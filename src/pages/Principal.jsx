import {
  Center,
  Button,
  Progress,
  UnorderedList,
  Flex,
  Box,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import ItemList from "../components/ItemList";
import { ListsContext } from "../context/ListsContext";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { AlertContext } from "../context/AlertContext";
import { auth, storage } from "../Firebase/FbApp";

export default function Principal() {
  const [file, setFile]           = useState();
  const [load, setLoad]           = useState();
  const [loadValue, setLoadValue] = useState();
  const [loading, setLoading]     = useState(false);

  // Pega todas as listas de arquivos do context
  const {
    documentsList,
    imagesList,
    videosList,
    audiosList,
    generalList,
    MountRefsList,
  } = useContext(ListsContext);

  // Funções originadas do contexto utilizadas para determinar se o alerta de adição de arquivo está ativo e em qual das lista deve estar
  const { GetAlert, GetAlertActive } = useContext(AlertContext);

  // Será preenchido com o id do usuário
  const [userInfo, setUserInfo] = useState();

  const navigate = useNavigate();

  // Cria o input que irá armazenar o arquivo escolhido
  const inputFile = document.createElement("input");
  inputFile.setAttribute("type", "file");
  inputFile.addEventListener("change", (e) => {
    setFile(e.target.files[0]);
  });

  useEffect(() => {
    // Verifica se quem está acessando o site está logado/autenticado
    onAuthStateChanged(auth, (user) => {
      // Se existir usuário(user), ele armazena o id do usuário e carregas as listas do arquivos
      if (user) {
        setUserInfo(user.uid);

        MountRefsList();
      }
      // Se não existir usuário(user), ele retorna para a tela de login
      else {
        navigate("/Login");
      }
    });
  }, []);

  // Função utilizada para deslogar
  function SignOut() {
    auth.signOut().then(() => {
      navigate("/Login");
    });
  }

  // Verifica se há algum arquivo selecionado antes de enviar
  function CheckFile() {
    if (file == null) {
      Swal.fire({
        icon: "info",
        text: "Selecione um arquivo!",
        showConfirmButton: false,
        position: "bottom-end",
        backdrop: false,
        timer: 1000,
        timerProgressBar: true,
      });
    } else {
      Send();
    }
  }

  // Envia o arquivo selecionado
  function Send() {
    // Armazena o tipo do arquivo e declara a variável que ira ser preenchida com a "pasta" de destino do arquivo
    const docType = getFileExtension(file.name);
    let reference;

    // switch que irá definir a "pasta" de destino do arquivo
    // Obs: Não achei uma forma mais eficiente para realizar essa escolhar
    switch (docType) {
      case "pdf":
      case "ppt":
      case "pptx":
      case "doc":
      case "docx":
      case "txt":
      case "xls":
      case "xlsx":
      case "rtf":
      case "xml":
        reference = "Documentos";
        GetAlert("Documentos");
        break;

      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "svg":
      case "tiff":
      case "eps":
        reference = "Imagens";
        GetAlert("Imagens");
        break;

      case "mp4":
      case "mov":
      case "wmv":
      case "avi":
      case "avchd":
      case "flv":
      case "f4v":
      case "swf":
      case "mkv":
      case "webm":
      case "mpeg-2":
        reference = "Videos";
        GetAlert("Vídeos");
        break;

      case "mp3":
      case "flac":
      case "wav":
      case "aac":
      case "mqa":
      case "ogg":
        reference = "Audios";
        GetAlert("Áudios");
        break;

      default:
        reference = "Geral";
        GetAlert("Geral");
        break;
    }

    // Monta a referência do arquivo
    // Obs: Utilizei o id do usuário na referência para que fosse impossível que dois ou mais usuários compartilhassem arquivos
    const nowDocumentRef = ref(
      storage,
      `${userInfo}/${reference}/${file.name}`
    );
    const metadata = {
      contentType: `${file.type}`,
    };
    const uploadDocument = uploadBytesResumable(nowDocumentRef, file, metadata);
    Upload(uploadDocument);
  }

  // Efetua o click no input virtual para possibilitar a escolha do arquivo
  function ChooseFile() {
    inputFile.click();
  }

  // Função que retorna a extensão do arquivo
  function getFileExtension(fileName) {
    return fileName.split(".").pop();
  }

  // Função responsável por enviar o arquivo para o storage do Firebase
  function Upload(data) {
    data.on(
      "state_changed",
      (snapshot) => {
        setLoading(true);
        setLoadValue(
          ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
        );
        setLoad(
          `Enviando: ${(
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0)}%`
        );
        switch (snapshot.state) {
          case "running":
            console.log("Enviando.");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            Swal.fire({
              icon: "error",
              text: "Sem autorização!",
              showConfirmButton: false,
              position: "bottom-end",
              backdrop: false,
              timer: 1000,
              timerProgressBar: true,
            });
            break;

          case "storage/canceled":
            Swal.fire({
              icon: "error",
              text: "Envio cancelado!",
              showConfirmButton: false,
              position: "bottom-end",
              backdrop: false,
              timer: 1000,
              timerProgressBar: true,
            });
            break;

          case "storage/unknown":
            Swal.fire({
              icon: "error",
              text: "Esse link é desconhecido!",
              showConfirmButton: false,
              position: "bottom-end",
              backdrop: false,
              timer: 1000,
              timerProgressBar: true,
            });
            break;
        }
      },
      () => {
        FinalizeLoad();
        setFile(null);
        MountRefsList();
      }
    );
  }

  // Avisa que o envio foi concluído e ativa o alerta
  function FinalizeLoad() {
    setLoad("Envio concluído.");
    GetAlertActive(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }

  // Verifica o tamanho do arquivo e trata para a exibição
  function FileSize() {
    if (file == null) {
      return <>0 b</>;
    }

    let dataType = "B";
    let strSize = `${file.size}`;
    let size = file.size;

    if (strSize.length > 3 && strSize.length <= 6) {
      dataType = "KB";
      size = (size / 1000).toFixed(2);
    } else if (strSize.length > 6 && strSize.length <= 9) {
      dataType = "MB";
      size = (size / 1000000).toFixed(2);
    } else if (strSize.length > 9) {
      dataType = "GB";
      size = (size / 1000000000).toFixed(2);
    }

    return <>{`${size} ${dataType}`}</>;
  }

  return (
    <Center w="100%" mb="50px">
      <VStack spacing={5} className="container">
        <Box className="Adiciona" mt="50px" w="80%">
          <Flex mb="30px">
            <Button colorScheme="red" onClick={SignOut}>
              Sair
            </Button>
            <Spacer />
          </Flex>
          <Box
            background="#0001"
            w="100%"
            border="1px"
            borderColor="#aaa"
            borderRadius="10px"
          >
            <Flex m="10px" direction="column" justify="space-between" gap="5px">
              <Box>
                Arquivo: {file != null && file.name}{" "}
                {file == null && "Selecione um arquivo."}
              </Box>
              <Box>Tamanho: {FileSize()}</Box>
            </Flex>
          </Box>
          <Flex mt="30px" gap="10px">
            <Spacer />
            <Button colorScheme="facebook" onClick={ChooseFile}>
              Escolher Arquivo
            </Button>
            <Button colorScheme="linkedin" onClick={CheckFile}>
              Enviar
            </Button>
          </Flex>
        </Box>
        <Box className="Load" w="80%">
          {loading && (
            <>
              {load}
              <Progress
                value={loadValue}
                colorScheme={loadValue < 100 ? "facebook" : "linkedin"}
                hasStripe={loadValue < 100 ? true : false}
                isAnimated={true}
                mt="5px"
                mb="10px"
              />
            </>
          )}
        </Box>
        <Box w="80%" overflow="none" className="Lista">
          <UnorderedList styleType="none" ms="0px" w="100%" spacing="10px">
            {/* Aba dos Documentos */}
            <ItemList refName="Documentos" items={documentsList} />

            {/* Aba das Imagens */}
            <ItemList refName="Imagens" items={imagesList} />

            {/* Aba das Vídeos */}
            <ItemList refName="Vídeos" items={videosList} />

            {/* Aba das Áudios */}
            <ItemList refName="Áudios" items={audiosList} />

            {/* Aba Geral */}
            <ItemList refName="Geral" items={generalList} />
          </UnorderedList>
        </Box>
      </VStack>
    </Center>
  );
}
