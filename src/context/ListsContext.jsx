import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, list, ref } from "firebase/storage";
import { createContext, useState } from "react";

export const ListsContext = createContext();

export const ListsProvider = ({children}) => {
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
    const storage = getStorage(app);
    const auth = getAuth(app);

    const [documentsList, setDocumentsList] = useState([]);
    const [imagesList, setImagesList]       = useState([]);
    const [videosList, setVideosList]       = useState([]);
    const [audiosList, setAudiosList]       = useState([]);
    const [generalList, setGeneralList]     = useState([]);

    async function MountRefsList() {
            onAuthStateChanged(auth, (user) => {            
            const documentsRef = ref(storage, `${user.uid}/Documentos`);
            list(documentsRef).then((response) => {
              setDocumentsList(response.items);
              //console.log(documentsList);
            });
        
            const imagesRef = ref(storage, `${user.uid}/Imagens`);
            list(imagesRef).then((response) => {
              setImagesList(response.items);
              // console.log(imagesList);
            });

            const videosRef = ref(storage, `${user.uid}/Videos`);
            list(videosRef).then((response) => {
              setVideosList(response.items);
              // console.log(videosList);
            });

            const audiosRef = ref(storage, `${user.uid}/Audios`);
            list(audiosRef).then((response) => {
              setAudiosList(response.items);
              // console.log(audiosList);
            });
        
            const generalRef = ref(storage, `${user.uid}/Geral`);
            list(generalRef).then((response) => {
              setGeneralList(response.items);
              //console.log(generalList);
            });
        })
        
      }

    return (
        <ListsContext.Provider value = {{documentsList, imagesList, videosList, audiosList, generalList, MountRefsList}}>
            {children}
        </ListsContext.Provider>
    )
}