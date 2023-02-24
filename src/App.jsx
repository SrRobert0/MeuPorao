import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  list as fbList,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";

function App() {
  const [file, setFile] = useState();
  const [list, setList] = useState([]);

  const firebaseConfig = {
    apiKey: "AIzaSyCb29pBrD7WqfPyrFGmvgQbx2mAvWTgnAc",
    authDomain: "herorpg-ced63.firebaseapp.com",
    projectId: "herorpg-ced63",
    storageBucket: "herorpg-ced63.appspot.com",
    messagingSenderId: "661706376397",
    appId: "1:661706376397:web:9891f40a8d0852ccd39584",
    measurementId: "G-09VZFF22TH",
  };
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  useEffect(() => {
    MontaLista()
  }, []);

  async function MontaLista() {
    const imagesRef = ref(storage, "images/");
    const imagesList = await fbList(imagesRef);

    setList(imagesList.items);
  }

  function Enviar() {
    const nowImageRef = ref(storage, `images/${file.name}`);
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadImage = uploadBytesResumable(nowImageRef, file, metadata);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          MontaLista();
        });
      }
    );
  }

  function Baixar(item) {
    const a = document.createElement("a");

    getDownloadURL(ref(storage, item._location.path))
    .then((url) => {
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.click();
    })
  }

  return (
    <div className="App">
      <div className="Adiciona">
        Arquivo:{" "}
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <button onClick={Enviar}>Enviar</button>
      </div>
      <div className="Lista">
        <ul>
          {list.map((item, key) => {
            return <li key={key} onClick={() => {Baixar(item)}}>{item.name}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
