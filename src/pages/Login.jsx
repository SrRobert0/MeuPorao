import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../Firebase/FbApp";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Verifica se o usário deixou os campos vázios
  function CheckFields() {
    if (email.length == 0 || password.length == 0) {
      Swal.fire({
        title: "Erro ao efetuar login!",
        icon: "info",
        text: "Não deixe nenhum campo vázio.",
        backdrop: false,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      LogIn();
    }
  }

  // Função responsável por efetuar o login
  function LogIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/Principal");
      })
      .catch((err) => {
        //console.log("Erro ao efetuar login: " + err.message)

        Swal.fire({
          title: "Erro ao efetuar login!",
          icon: "error",
          text: "Verifique suas credenciais e tente novamente.",
          backdrop: false,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 2000,
        });
      });
  }

  return (
    <Box h="100vh" w="100%" bg="gray" className="formBox">
      <Center h="100vh">
        <FormControl
          w="350px"
          bg="WhiteSmoke"
          className="formBox"
          p="20px"
          borderRadius={10}
        >
          <Center mb="30px">
            <Heading>Login</Heading>
          </Center>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            mb="10px"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Center mt="30px">
            <Button colorScheme="linkedin" onClick={() => CheckFields()}>
              Logar
            </Button>
          </Center>
          <FormHelperText mt="15px">
            Não tem uma conta?{" "}
            <Link to="/Cadastro" className="formLink">
              Clique aqui!
            </Link>
          </FormHelperText>
        </FormControl>
      </Center>
    </Box>
  );
}
