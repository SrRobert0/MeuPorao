import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Cadastro() {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    function Cadastrar() {
        console.log(`Usuário: ${username}, Email: ${email}, Senha: ${password}`)
    }

  return (
    <Box h="100vh" w="100%" bg="gray">
      <Center h="100vh">
        <FormControl w="350px" bg="WhiteSmoke" p="20px" borderRadius={10}>
          <Center mb="30px">
            <Heading>Cadastro</Heading>
          </Center>
          <FormLabel>Nome</FormLabel>
          <Input type="text" mb="10px" onChange={(e) => {setUsername(e.target.value)}} />
          <FormLabel>Email</FormLabel>
          <Input type="email" mb="10px" onChange={(e) => {setEmail(e.target.value)}} />
          <FormLabel>Senha</FormLabel>
          <Input type="password" onChange={(e) => {setPassword(e.target.value)}} />
          <Center mt="30px">
            <Button colorScheme="linkedin" onClick={Cadastrar} >Logar</Button>
          </Center>
          <FormHelperText mt="10px">Já tem uma conta? <Link to='/'>Clique aqui!</Link></FormHelperText>
        </FormControl>
      </Center>
    </Box>
  );
}
