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
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "../Firebase/FbApp";

export default function Cadastro() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Verifica se o usário deixou os campos vázios
  function CheckFields() {
    if (username.length == 0 || email.length == 0 || password.length == 0) {
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
      CreateUser();
    }
  }

  // Funão responsável por criar o usuário
  function CreateUser() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Está função é responsável apenas por alterar o nome do usuário que já foi criado, já que não é possível alterar o nome no memento da criação
        updateProfile(userCredential.user, {
          displayName: username,
        })
          .then(() => {
            //console.log("Usuário cadastrado com sucesso.");
            navigate("/");
          })
          .catch((err) => {
            //console.log("Erro ao tentar alterar usuário: " + err.message);

            Swal.fire({
              title: "Erro ao efetuar cadastro!",
              icon: "error",
              text: "Verifique as informações e tente novamente.",
              backdrop: false,
              position: "bottom-end",
              showConfirmButton: false,
              timer: 2000,
            });

            // Deleta o usuário caso ocorra algum erro no momento de alterar o nome para que seja possível que o usuário crie um usuário com o mesmo email
            deleteUser(userCrendital.user).then(() => {
              //console.log("Usuário excluído.");
            });
          });
      })
      .catch((err) => {
        //console.log("Erro ao tentar criar usuário: " + err.message);

        Swal.fire({
          title: "Erro ao efetuar cadastro!",
          icon: "error",
          text: "Verifique as informações e tente novamente.",
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
            <Heading>Cadastro</Heading>
          </Center>
          <FormLabel>Nome</FormLabel>
          <Input
            type="text"
            mb="10px"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
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
            <Button
              colorScheme="linkedin"
              onClick={() => {
                CheckFields();
              }}
            >
              Cadastrar
            </Button>
          </Center>
          <FormHelperText mt="10px">
            Já tem uma conta?{" "}
            <Link to="/Login" className="formLink">
              Clique aqui!
            </Link>
          </FormHelperText>
        </FormControl>
      </Center>
    </Box>
  );
}
