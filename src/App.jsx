import {
  Center,
  Button,
  Input,
  ListItem,
  Progress,
  UnorderedList,
  Flex,
  Box,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  list as fbList,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";

function App() {
  const [file, setFile] = useState();
  const [list, setList] = useState([]);
  const [load, setLoad] = useState();
  const [loadValue, setLoadValue] = useState();
  const [loaded, setLoaded] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyCb29pBrD7WqfPyrFGmvgQbx2mAvWTgnAc",
    authDomain: "herorpg-ced63.firebaseapp.com",
    projectId: "herorpg-ced63",
    storageBucket: "herorpg-ced63.appspot.com",
    messagingSenderId: "661706376397",
    appId: "1:661706376397:web:9891f40a8d0852ccd39584",
    measurementId: "G-09VZFF22TH",
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  useEffect(() => {
    MontaLista();
  }, []);

  async function MontaLista() {
    const imagesRef = ref(storage, "images/");
    const imagesList = await fbList(imagesRef);

    setList(imagesList.items);
  }

  function Enviar() {
    const docType = getFileExtension(file.name)
    
    switch(docType) {
      case "jpg" :
      case "jpeg" :
      case "png" :
        EnviarImagem();
        break;
      default:
        setLoad("Tipo de arquivo não suportado.");
    }
  }

  function getFileExtension(fileName) {
    return fileName.split('.').pop();
  }

  function EnviarImagem() {
    const nowImageRef = ref(storage, `images/${file.name}`);
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadImage = uploadBytesResumable(nowImageRef, file, metadata);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        setLoaded(true);
        setLoadValue(
          ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2)
        );
        setLoad(
          `Enviando: ${(
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(2)}%`
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
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          setLoad("Envio concluído.");
          MontaLista();
        });
      }
    );
  }

  function Baixar(item) {
    getDownloadURL(ref(storage, item._location.path)).then((url) => {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.click();
    });
  }

  return (
    <Center w="100%">
      <VStack spacing={5} w="50%">
        <Box className="Adiciona" mt="50px">
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
            <Button onClick={Enviar}>Enviar</Button>
          </Flex>
        </Box>
        <Box className="Load" w="80%">
          {loaded && (
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
        <Box className="Lista" overflow="auto">
          <UnorderedList styleType="none" spacing={4}>
            {list.map((item, key) => {
              return (
                <ListItem
                  key={key}
                  onClick={() => {
                    Baixar(item);
                  }}
                >
                  {item.name}
                </ListItem>
              );
            })}
          </UnorderedList>
        </Box>
      </VStack>
    </Center>
  );
}

export default App;
