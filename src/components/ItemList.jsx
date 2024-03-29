import {
  DeleteIcon,
  LinkIcon,
  ViewIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
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
  Circle,
  Spacer,
} from "@chakra-ui/react";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AlertContext } from "../context/AlertContext";
import { ListsContext } from "../context/ListsContext";
import { storage } from "../Firebase/FbApp";

// Informações vindas da tela principal
// refName: Nome da aba
// items: Lista dos itens
export default function ItemList({ refName, items }) {
  const [deleting, setDeleting] = useState({ objectName: "" });

  const { MountRefsList }                      = useContext(ListsContext);
  const { alert, alertActive, GetAlertActive } = useContext(AlertContext);

  // Função que pega o link do item no storage, gera um link virtual e "clica" no mesmo
  function View(item) {
    getDownloadURL(ref(storage, item._location.path)).then((url) => {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.click();
    });
  }

  // Função que pega o link do item no storage e copia para a área de tranferência automaticamente
  function Share(item) {
    getDownloadURL(ref(storage, item._location.path)).then((url) => {
      navigator.clipboard.writeText(url);

      Swal.fire({
        position: "bottom-end",
        text: "Copiado para a área de transferência!",
        showConfirmButton: false,
        backdrop: false,
        timer: 2000,
        timerProgressBar: true,
      });
    });
  }

  //Função responsável por apagar o item do storage
  function Delete(item) {
    deleteObject(ref(storage, item._location.path))
      .then(() => {
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: "Arquivo excluído com sucesso!",
          showConfirmButton: false,
          backdrop: false,
          timer: 2000,
          timerProgressBar: true,
        });

        MountRefsList();
      })
      .catch((err) => {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Ocorreu um erro ao tentar excluir o arquivo!",
          showConfirmButton: false,
          backdrop: false,
          timer: 2000,
          timerProgressBar: true,
        });
      });
  }

  return (
    <ListItem
      w="100%"
      border="1px"
      borderColor="#aaa"
      borderRadius="10px"
      onClick={() => {
        if (alert == refName) {
          GetAlertActive(false);
        }
      }}
    >
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
                <Flex
                  as="span"
                  direction="row"
                  align="center"
                  gap="10px"
                  textAlign="left"
                >
                  {refName}
                  {alert == refName && alertActive && (
                    <Circle
                      background="whatsapp.500"
                      w="10px"
                      h="10px"
                      me="5px"
                      className="alertAnimation"
                    />
                  )}
                </Flex>
                <Spacer />
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel mt="12px">
                <UnorderedList styleType="none" w="100%" spacing="10px">
                  {items.map((item, key) => {
                    return (
                      <ListItem key={key} className="listItem">
                        <Flex
                          flexDirection="column"
                          justify="space-between"
                          mt={key >= 1 ? "25px" : ""}
                          me="30px"
                        >
                          {item.name}
                          <Flex
                            borderTop="1px"
                            borderColor="#0004"
                            pt="5px"
                            flexDirection="row"
                            align="center"
                            gap="15px"
                          >
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
                                onClick={() => {
                                  Delete(item);
                                }}
                                className="listIcon"
                              >
                                <WarningTwoIcon
                                  color="white"
                                  size="10px"
                                  m="5px"
                                />
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