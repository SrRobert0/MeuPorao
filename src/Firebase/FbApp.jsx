import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Criei esse componente com essas declarações para que não fosse necessário repeti-lás em todas as páginas que fossem utilizadas. Isso acabou deixando o código mais clean.
// As configurações do firebase são postas aqui
const firebaseConfig = {
  };

  // Declaração do app do Firebase em si e dos serviços utilizados no projeto
  export const app     = initializeApp(firebaseConfig);
  export const storage = getStorage(app);
  export const auth    = getAuth(app);