import {
  Center,
  Button,
  Input,
  Progress,
  UnorderedList,
  Flex,
  Box,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import ItemList from "../components/ItemList";
import { ListsContext } from "../context/ListsContext";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Principal() {
  const [file, setFile] = useState();
  const [load, setLoad] = useState();
  const [loadValue, setLoadValue] = useState();
  const [loading, setLoading] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyAwi9b_qwMv90_fQ19d28cyhCfk1V9en_U",
    authDomain: "desenvolvimento-a7043.firebaseapp.com",
    projectId: "desenvolvimento-a7043",
    storageBucket: "desenvolvimento-a7043.appspot.com",
    messagingSenderId: "207411264327",
    appId: "1:207411264327:web:080c6f1bf58065be0a6a62",
    measurementId: "G-5Q0ZSP9QWQ",
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const auth = getAuth(app);

  const { documentsList, imagesList, generalList, MountRefsList } =
    useContext(ListsContext);

  const [username, setUsername] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName);

        MountRefsList();
      } else {
        navigate("/");
      }
    });
  }, []);

  function SignOut() {
    auth.signOut().then(() => {
      navigate("/");
    });
  }

  function Enviar() {
    const docType = getFileExtension(file.name);
    let reference, content;

    // Adicionar: PDF, Executáveis, videos, audios

    switch (docType) {
      case ("jpg", "jpeg", "png"):
        reference = "Imagens";
        content = "image";
        break;
      case "pdf":
        reference = "Documentos";
        content = "document";
        break;
      default:
        reference = "Geral";
        content = "document";
    }

    const nowDocumentRef = ref(
      storage,
      `${username}/${reference}/${file.name}`
    );
    const metadata = {
      contentType: `${content}/${docType}`,
    };
    const uploadDocument = uploadBytesResumable(nowDocumentRef, file, metadata);
    Upload(uploadDocument);
  }

  function getFileExtension(fileName) {
    return fileName.split(".").pop();
  }

  function Upload(data) {
    data.on(
      "state_changed",
      (snapshot) => {
        setLoading(true);
        setLoadValue(
          ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
        );
        setLoad(
          `Enviando: ${(
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0)}%`
        );
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        setLoad("Envio concluído.");
        MountRefsList();
      }
    );
  }

  return (
    <Center w="100%">
      <VStack spacing={5} className="container">
        <Box className="Adiciona" mt="50px" w="80%">
          <Flex mb="30px">
            <Button colorScheme="red" onClick={SignOut}>
              Sair
            </Button>
            <Spacer />
          </Flex>
          <Input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            pt="30px"
            pb="60px"
          />
          <Flex mt="30px">
            <Spacer />
            <Button colorScheme="linkedin" onClick={Enviar}>Enviar</Button>
          </Flex>
        </Box>
        <Box className="Load" w="80%">
          {loading && (
            <>
              {load}
              <Progress
                value={loadValue}
                colorScheme={loadValue < 100 ? "cyan" : "green"}
                hasStripe={loadValue < 100 ? true : false}
                isAnimated={true}
                mt="5px"
                mb="10px"
              />
            </>
          )}
        </Box>
        <Box w="80%" overflow="none" className="Lista">
          <UnorderedList styleType="none" ms="0px" w="100%" spacing="10px">
            {/* Aba dos Documentos */}
            <ItemList refName="Documentos" items={documentsList} />

            {/* Aba das Imagens */}
            <ItemList refName="Imagens" items={imagesList} />

            {/* Aba Geral */}
            <ItemList refName="Geral" items={generalList} />
          </UnorderedList>
        </Box>
      </VStack>
    </Center>
  );
}
