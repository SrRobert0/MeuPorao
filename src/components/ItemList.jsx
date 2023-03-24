import { DeleteIcon, LinkIcon, ViewIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
  Box,
  Flex,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { ListsContext } from "../context/ListsContext";

export default function ItemList({ refName, items }) {
    const [deleting, setDeleting] = useState({objectName: ""})

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

    const { MountRefsList } = useContext(ListsContext);

    function View(item) {
      getDownloadURL(ref(storage, item._location.path))
      .then((url) => {
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("target", "_blank");
        a.click();
      });
    }

    function Share(item) {
      getDownloadURL(ref(storage, item._location.path))
      .then((url) => {
        navigator.clipboard.writeText(url);

        Swal.fire({
          position: 'bottom-end',
          text: 'Copiado para a área de transferência!',
          showConfirmButton: false,
          backdrop: false,
          timer: 2000,
          timerProgressBar: true,
        })
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
          Swal.fire({
            position: 'bottom-end',
            icon: 'error',
            title: 'Ocorreu um erro ao tentar excluir o arquivo!',
            showConfirmButton: false,
            backdrop: false,
            timer: 2000,
            timerProgressBar: true,
          })
        });
    }

  return (
    <ListItem w="100%" border="1px" borderColor="#aaa" borderRadius="10px">
      <Accordion border="#0000" allowMultiple>
        <AccordionItem>
        {({ isExpanded }) => (
          <>
          <AccordionButton
            background="#0002"
            borderRadius="10px"
            borderBottomRadius={isExpanded ? "0px" : "10px"}
            _hover={{ background: "#0001" }}
          >
            <Box as="span" flex="1" textAlign="left">
              {refName}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel mt="12px">
            <UnorderedList styleType="none" w="100%" spacing="10px">
              {items.map((item, key) => {
                return (
                  <ListItem key={key} className="listItem">
                    <Flex
                      flexDirection="row"
                      align="center"
                      justify="space-between"
                      me="30px"
                    >
                      {item.name}
                      <Flex flexDirection="row" align="center" gap="15px">
                        {!(deleting.objectName == item.name) && (
                          <Box
                            bg="red.400"
                            w="fit-content"
                            borderRadius="5px"
                            cursor="pointer"
                            _hover={{ background: "red.500" }}
                            onClick={() => {
                              setDeleting({ objectName: item.name });
                              setTimeout(() => {
                                setDeleting({ objectName: "" });
                              }, 2500);
                            }}
                            className="listIcon"
                          >
                            <DeleteIcon color="white" size="10px" m="5px" />
                          </Box>
                        )}
                        {deleting.objectName == item.name && (
                          <Box
                            bg="yellow.400"
                            w="fit-content"
                            borderRadius="5px"
                            cursor="pointer"
                            _hover={{ background: "yellow.500" }}
                            onClick={() => {Delete(item)}}
                            className="listIcon"
                          >
                            <WarningTwoIcon color="white" size="10px" m="5px" />
                          </Box>
                        )}
                        <Box
                          bg="linkedin.300"
                          w="fit-content"
                          borderRadius="5px"
                          cursor="pointer"
                          _hover={{ background: "linkedin.400" }}
                          onClick={() => Share(item)}
                          className="listIcon"
                        >
                          <LinkIcon color="white" size="10px" m="5px" />
                        </Box>
                        <Box
                          bg="facebook.400"
                          w="fit-content"
                          borderRadius="5px"
                          cursor="pointer"
                          _hover={{ background: "facebook.500" }}
                          onClick={() => View(item)}
                          className="listIcon"
                        >
                          <ViewIcon color="white" size="10px" m="5px" />
                        </Box>
                      </Flex>
                    </Flex>
                  </ListItem>
                );
              })}
            </UnorderedList>
          </AccordionPanel>
          </>
        )}
        </AccordionItem>
      </Accordion>
    </ListItem>
  );
}
