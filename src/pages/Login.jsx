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
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

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

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate('/Principal')
        }
      })
    })

    function LogIn() {
      signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/Principal');
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
        })
      })
    }

  return (
    <Box h="100vh" w="100%" bg="gray" className="formBox">
      <Center h="100vh">
        <FormControl w="350px" bg="WhiteSmoke" className="formBox" p="20px" borderRadius={10}>
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
          <FormHelperText mt="10px">Não tem uma conta? <Link to='/Cadastro' className="formLink">Clique aqui!</Link></FormHelperText>
        </FormControl>
      </Center>
    </Box>
  );
}
