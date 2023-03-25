import { Center, Spinner } from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { app, auth } from "../Firebase/FbApp";

export default function Loading() {
    const navigate = useNavigate();

    useEffect(() => {
      // Verifica se quem está acessando o site está logado/autenticado
      // Se ele estiver, será redirecionado diretamente para a página principal, caso não esteja, será redirecionado para a tela de login
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate('/Principal');
        } else {
          navigate('/Login');
        }
      })
    })

    return (
        <Center h="100vh">
            <Spinner speed='0.7s' size="lg" emptyColor="gray.200" />
        </Center>
    )
}