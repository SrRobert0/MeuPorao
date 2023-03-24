import { ListItem } from "@chakra-ui/react";
import { list, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Pasta({ name, info }) {

  useEffect(() => {
    console.log(info);
  }, [])

  return (
    <ListItem w="400px">
      {name}
    </ListItem>
  );
}
