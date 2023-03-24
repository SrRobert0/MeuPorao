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
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    function LogIn() {
      navigate('Principal');
    }

  return (
    <Box h="100vh" w="100%" bg="gray">
      <Center h="100vh">
        <FormControl w="350px" bg="WhiteSmoke" p="20px" borderRadius={10}>
          <Center mb="30px">
            <Heading>Login</Heading>
          </Center>
          <FormLabel>Email</FormLabel>
          <Input type="email" mb="10px" onChange={(e) => {setEmail(e.target.value)}} />
          <FormLabel>Senha</FormLabel>
          <Input type="password" onChange={(e) => {setPassword(e.target.value)}} />
          <Center mt="30px">
            <Button colorScheme="linkedin" onClick={() => LogIn()}>Logar</Button>
          </Center>
          <FormHelperText mt="10px">Não tem uma conta? <Link to='/Cadastro'>Clique aqui!</Link></FormHelperText>
        </FormControl>
      </Center>
    </Box>
  );
}
