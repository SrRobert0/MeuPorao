import {
  Center,
  Button,
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
import Swal from "sweetalert2";
import { AlertContext } from "../context/AlertContext";

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

  const { documentsList, imagesList, videosList, audiosList, generalList, MountRefsList } = useContext(ListsContext);
  const { GetAlert, GetAlertActive } = useContext(AlertContext);

  const [userInfo, setUserInfo] = useState();

  const navigate = useNavigate();

  // Criar o input que irá armazenar o arquivo escolhido
  const inputFile = document.createElement("input");
  inputFile.setAttribute("type", "file");

  inputFile.addEventListener("change", (e) => {setFile(e.target.files[0])})

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo(user.uid);

        MountRefsList();
      } else {
        navigate("/Login");
      }
    });
  }, []);

  function SignOut() {
    auth.signOut().then(() => {
      navigate("/Login");
    });
  }

  function CheckFile() {
    if (file == null) {
      Swal.fire({
        icon: "info",
        text: "Selecione um arquivo!",
        showConfirmButton: false,
        position: "bottom-end",
        backdrop: false,
        timer: 1000,
        timerProgressBar: true,
      })
    } else {
      Send();
    } 
  }

  function Send() {
    const docType = getFileExtension(file.name);
    let reference;

    console.log(docType);

    // Adicionar: PDF, Executáveis, videos, audios

    switch (docType) {
      case "pdf":
      case "ppt":
      case "pptx":
      case "doc":
      case "docx":
      case "txt":
      case "xls":
      case "xlsx":
      case "rtf":
      case "xml":
        reference = "Documentos";
        GetAlert("Documentos");
        break;

      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "svg":
      case "tiff":
      case "eps":
        reference = "Imagens";
        GetAlert("Imagens");
        break;

      case "mp4":
      case "mov":
      case "wmv":
      case "avi":
      case "avchd":
      case "flv":
      case "f4v":
      case "swf":
      case "mkv":
      case "webm":
      case "mpeg-2":
        reference = "Videos";
        GetAlert("Vídeos");
        break;
        
      case "mp3":
      case "flac":
      case "wav":
      case "aac":
      case "mqa":
      case "ogg":
        reference = "Audios";
        GetAlert("Áudios");
        break;

      default:
        reference = "Geral";
        GetAlert("Geral");
        break;
    }

    const nowDocumentRef = ref(
      storage,
      `${userInfo}/${reference}/${file.name}`
    );
    const metadata = {
      contentType: `${file.type}`,
    };
    const uploadDocument = uploadBytesResumable(nowDocumentRef, file, metadata);
    Upload(uploadDocument);
  }

  function ChooseFile() {
    inputFile.click();
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
        FinalizeLoad();
        setFile(null);
        MountRefsList();
      }
    );
  }

  function FinalizeLoad() {
    setLoad("Envio concluído.");
    GetAlertActive(true);
    setTimeout(() => {setLoading(false)} , 4000);
  }

  function FileSize() {
    if (file == null) {
      return <>0 b</>
    } 
    
    let dataType = "B"; 
    let strSize     = `${file.size}`;
    let size = file.size;

    if (strSize.length > 3) {
      dataType = "KB";
      size = (size / 1000).toFixed(2);
    } else if (strSize.length > 6) {
      dataType = "MB";
      size = (size / 1000000).toFixed(2);
    } else if (strSize.length > 9) {
      dataType = "GB";
      size = (size / 1000000000).toFixed(2);
    }

    return (
      <>{`${size} ${dataType}`}</>
    )
  }

  return (
    <Center w="100%" mb="50px">
      <VStack spacing={5} className="container">
        <Box className="Adiciona" mt="50px" w="80%">
          <Flex mb="30px">
            <Button colorScheme="red" onClick={SignOut}>
              Sair
            </Button>
            <Spacer />
          </Flex>
          <Box background="#0001" w="100%" border="1px" borderColor="#aaa" borderRadius="10px">
            <Flex m="10px" direction="column" justify="space-between" gap="5px">
              <Box>
                Arquivo: {(file != null) && (file.name)} {(file == null) && ("Selecione um arquivo.")}
              </Box>
              <Box>
                Tamanho: {FileSize()}
              </Box>
            </Flex>
          </Box>
          <Flex mt="30px" gap="10px">
            <Spacer />
            <Button colorScheme="facebook" onClick={ChooseFile}>Escolher Arquivo</Button>
            <Button colorScheme="linkedin" onClick={CheckFile}>Enviar</Button>
          </Flex>
        </Box>
        <Box className="Load" w="80%">
          {loading && (
            <>
              {load}
              <Progress
                value={loadValue}
                colorScheme={loadValue < 100 ? "facebook" : "linkedin"}
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

            {/* Aba das Vídeos */}
            <ItemList refName="Vídeos" items={videosList} />

            {/* Aba das Áudios */}
            <ItemList refName="Áudios" items={audiosList} />

            {/* Aba Geral */}
            <ItemList refName="Geral" items={generalList} />
          </UnorderedList>
        </Box>
      </VStack>
    </Center>
  );
}
