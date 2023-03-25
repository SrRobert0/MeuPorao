import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Criei esse componente com essas declarações para que não fosse necessário repeti-lás em todas as páginas que fossem utilizadas. Isso acabou deixando o código mais clean.
// As configurações do firebase são postas aqui
const firebaseConfig = {
    apiKey: "AIzaSyAwi9b_qwMv90_fQ19d28cyhCfk1V9en_U",
    authDomain: "desenvolvimento-a7043.firebaseapp.com",
    projectId: "desenvolvimento-a7043",
    storageBucket: "desenvolvimento-a7043.appspot.com",
    messagingSenderId: "207411264327",
    appId: "1:207411264327:web:080c6f1bf58065be0a6a62",
    measurementId: "G-5Q0ZSP9QWQ",
  };

  // Declaração do app do Firebase em si e dos serviços utilizados no projeto
  export const app     = initializeApp(firebaseConfig);
  export const storage = getStorage(app);
  export const auth    = getAuth(app);