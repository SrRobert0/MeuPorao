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
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, deleteUser, getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Cadastro() {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

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
    const auth = getAuth(app);

    const navigate = useNavigate();

    function Cadastrar() {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: username,
        })
        .then(() => {
          //console.log("Usuário cadastrado com sucesso.");
          navigate('/');
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
          })

          deleteUser(userCrendital.user).then(() => {
            //console.log("Usuário excluído.");
          })
        })
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
        })
      })
    }

  return (
    <Box h="100vh" w="100%" bg="gray" className="formBox">
      <Center h="100vh">
        <FormControl w="350px" bg="WhiteSmoke" className="formBox" p="20px" borderRadius={10}>
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
            <Button colorScheme="linkedin" onClick={Cadastrar} >Cadastrar</Button>
          </Center>
          <FormHelperText mt="10px">Já tem uma conta? <Link to='/Login' className="formLink">Clique aqui!</Link></FormHelperText>
        </FormControl>
      </Center>
    </Box>
  );
}
