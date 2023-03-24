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
  AccordionItem,
  AccordionButton,
  Accordion,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  list as fbList,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import Pasta from "../components/Pasta";
import Swal from "sweetalert2";

export default function Principal() {
  const [file, setFile]                   = useState();
  const [load, setLoad]                   = useState();
  const [loadValue, setLoadValue]         = useState();
  const [loaded, setLoaded]               = useState(false);
  const [deleting, setDeleting]           = useState({objectName: ""})

  const [imagesList, setImagesList]       = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [generalList, setGeneralList]     = useState([]);

  const [username, setUsername]           = useState("Roberto");

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

  useEffect(() => {
    MountRefsList();
  }, []);

  async function MountRefsList() {
    const documentsRef = await ref(storage, `${username}/Documentos`);
    fbList(documentsRef).then((response) => {
      setDocumentsList(response.items);
      //console.log(documentsList);
    });

    const ImagesRef = await ref(storage, `${username}/Imagens`);
    fbList(ImagesRef).then((response) => {
      setImagesList(response.items);
      // console.log(imagesList);
    });

    const generalRef = await ref(storage, `${username}/Geral`);
    fbList(generalRef).then((response) => {
      setGeneralList(response.items);
      //console.log(generalList);
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
        setLoaded(true);
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
        getDownloadURL(data.snapshot.ref).then((downloadURL) => {
          setLoad("Envio concluído.");
          MountRefsList();
        });
      }
    );
  }

  function View(item) {
    getDownloadURL(ref(storage, item._location.path)).then((url) => {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.click();
    });
  }

  function Delete(item) {
    deleteObject(ref(storage, item._location.path))
      .then(() => {
        Swal.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Arquivo excluído com sucesso!',
          showConfirmButton: false,
          backdrop: false,
          timer: 2000,
          timerProgressBar: true,
        })

        MountRefsList();
      })
      .catch((err) => {
        console.log(err);
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
        <Box w="80%" overflow="none" className="Lista">
          <UnorderedList styleType="none" ms="0px" w="100%" spacing="10px">

            {/* Aba dos Documentos */}

            <ListItem
              w="100%"
              border="1px"
              borderColor="#aaa"
              borderRadius="10px"
            >
              <Accordion border="#0000" allowMultiple>
                <AccordionItem>
                  <AccordionButton
                    background="#0002"
                    _hover={{background: "#0001"}}
                  >
                    <Box as="span" flex="1" textAlign="left">
                      Documentos
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel mt="12px">
                    <UnorderedList styleType="none" w="100%" spacing="10px">
                      {documentsList.map((item, key) => {
                        return (
                          <ListItem key={key}>
                            <Flex
                              flexDirection="row"
                              align="center"
                              justify="space-between"
                              me="30px"
                            >
                              {item.name}
                              <Flex
                                flexDirection="row"
                                align="center"
                                gap="15px"
                              >
                                <Box
                                  bg="linkedin.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "linkedin.500" }}
                                  onClick={() => View(item)}
                                >
                                  <ViewIcon color="white" size="10px" m="5px" />
                                </Box>
                                {!(deleting.objectName == item.name) && (
                                <Box
                                  bg="red.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "red.500" }}
                                  onClick={() => {
                                    setDeleting({objectName: item.name})
                                    setTimeout(() => {setDeleting({objectName: ""})}, 2500);
                                  }}
                                >
                                  <DeleteIcon
                                    color="white"
                                    size="10px"
                                    m="5px"
                                  />
                                </Box>
                                )}
                                {(deleting.objectName == item.name) && (
                                <Box
                                  bg="yellow.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "yellow.500" }}
                                  onClick={() => {Delete(document)}}
                                >
                                  <WarningTwoIcon
                                    color="white"
                                   size="10px"
                                    m="5px"
                                 />
                                </Box>
                                )}
                              </Flex>
                            </Flex>
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ListItem>

            {/* Aba das Imagens */}

            <ListItem
              w="100%"
              border="1px"
              borderColor="#aaa"
              borderRadius="5px"
            >
              <Accordion border="#0000" allowMultiple>
                <AccordionItem>
                  <AccordionButton
                    background="#0002"
                    _hover={{background: "#0001"}}
                  >
                    <Box as="span" flex="1" textAlign="left">
                      Imagens
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel mt="12px">
                    <UnorderedList styleType="none" w="100%" spacing="10px">
                      {imagesList.map((item, key) => {
                        return (
                          <ListItem key={key}>
                            <Flex
                              flexDirection="row"
                              align="center"
                              justify="space-between"
                              me="30px"
                            >
                              {item.name}
                              <Flex
                                flexDirection="row"
                                align="center"
                                gap="15px"
                              >
                                <Box
                                  bg="linkedin.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "linkedin.500" }}
                                  onClick={() => View(item)}
                                >
                                  <ViewIcon color="white" size="10px" m="5px" />
                                </Box>
                                {!(deleting.objectName == item.name) && (
                                <Box
                                  bg="red.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "red.500" }}
                                  onClick={() => {
                                    setDeleting({objectName: item.name})
                                    setTimeout(() => {setDeleting({objectName: ""})}, 2500);
                                  }}
                                >
                                  <DeleteIcon
                                    color="white"
                                    size="10px"
                                    m="5px"
                                  />
                                </Box>
                                )}
                                {(deleting.objectName == item.name) && (
                                <Box
                                  bg="yellow.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "yellow.500" }}
                                  onClick={() => {Delete(document)}}
                                >
                                  <WarningTwoIcon
                                    color="white"
                                   size="10px"
                                    m="5px"
                                 />
                                </Box>
                                )}
                              </Flex>
                            </Flex>
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ListItem>

            {/* Aba Geral */}

            <ListItem
              w="100%"
              border="1px"
              borderColor="#aaa"
              borderRadius="5px"
            >
              <Accordion border="#0000" allowMultiple>
                <AccordionItem>
                  <AccordionButton
                    background="#0002"
                    _hover={{background: "#0001"}}
                  >
                    <Box as="span" flex="1" textAlign="left">
                      Geral
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel mt="12px">
                    <UnorderedList styleType="none" w="100%" spacing="10px">
                      {generalList.map((item, key) => {
                        const [deleting, setDeleting] = useState(false);
                        return (
                          <ListItem key={key}>
                            <Flex
                              flexDirection="row"
                              align="center"
                              justify="space-between"
                              me="30px"
                            >
                              {item.name}
                              <Flex
                                flexDirection="row"
                                align="center"
                                gap="15px"
                              >
                                <Box
                                  bg="linkedin.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "linkedin.500" }}
                                  onClick={() => View(item)}
                                >
                                  <ViewIcon color="white" size="10px" m="5px" />
                                </Box>
                                {!(deleting.objectName == item.name) && (
                                <Box
                                  bg="red.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "red.500" }}
                                  onClick={() => {
                                    setDeleting({objectName: item.name})
                                    setTimeout(() => {setDeleting({objectName: ""})}, 2500);
                                  }}
                                >
                                  <DeleteIcon
                                    color="white"
                                    size="10px"
                                    m="5px"
                                  />
                                </Box>
                                )}
                                {(deleting.objectName == item.name) && (
                                <Box
                                  bg="yellow.400"
                                  w="fit-content"
                                  borderRadius="5px"
                                  cursor="pointer"
                                  _hover={{ background: "yellow.500" }}
                                  onClick={() => {Delete(document)}}
                                >
                                  <WarningTwoIcon
                                    color="white"
                                   size="10px"
                                    m="5px"
                                 />
                                </Box>
                                )}
                              </Flex>
                            </Flex>
                          </ListItem>
                        );
                      })}
                    </UnorderedList>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ListItem>
          </UnorderedList>
        </Box>
      </VStack>
    </Center>
  );
}