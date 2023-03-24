import { DeleteIcon, ViewIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
import { useState } from "react";

export default function ItemList({ refName, items }) {
    const [deleting, setDeleting] = useState({objectName: ""})

  return (
    <ListItem w="100%" border="1px" borderColor="#aaa" borderRadius="10px">
      <Accordion border="#0000" allowMultiple>
        <AccordionItem>
          <AccordionButton
            background="#0002"
            borderTop="10px"
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
                  <ListItem key={key}>
                    <Flex
                      flexDirection="row"
                      align="center"
                      justify="space-between"
                      me="30px"
                    >
                      {item.name}
                      <Flex flexDirection="row" align="center" gap="15px">
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
                              setDeleting({ objectName: item.name });
                              setTimeout(() => {
                                setDeleting({ objectName: "" });
                              }, 2500);
                            }}
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
                              Delete(document);
                            }}
                          >
                            <WarningTwoIcon color="white" size="10px" m="5px" />
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
  );
}
