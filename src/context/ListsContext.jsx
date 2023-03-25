import { onAuthStateChanged } from "firebase/auth";
import { list, ref } from "firebase/storage";
import { createContext, useState } from "react";
import { auth, storage } from "../Firebase/FbApp";

export const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
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
    });
  }

  return (
    <ListsContext.Provider
      value={{
        documentsList,
        imagesList,
        videosList,
        audiosList,
        generalList,
        MountRefsList,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
};