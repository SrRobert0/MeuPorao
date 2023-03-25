import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Loading from "./pages/Loading";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Principal from "./pages/Principal";
import { ListsProvider } from "./context/ListsContext";
import { AlertProvider } from "./context/AlertContext";
import "./styles/responsiveStyle.css";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Loading /> },
      { path: "/Login", element: <Login /> },
      { path: "/Cadastro", element: <Cadastro /> },
      { path: "/Principal", element: <Principal /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <AlertProvider>
        <ListsProvider>
          <RouterProvider router={route} />
        </ListsProvider>
      </AlertProvider>
    </ChakraProvider>
  </React.StrictMode>
);
