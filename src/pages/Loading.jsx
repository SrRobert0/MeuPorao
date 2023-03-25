import { Center, Spinner } from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loading() {
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

    return (
        <Center h="100vh">
            <Spinner speed='0.7s' size="lg" emptyColor="gray.200" />
        </Center>
    )
}