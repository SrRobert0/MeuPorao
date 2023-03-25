import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { ListsProvider } from "./context/ListsContext";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Principal from "./pages/Principal";
import Loading from "./pages/Loading";
import "./styles/responsiveStyle.css";
import { AlertProvider } from "./context/AlertContext";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Loading /> },
      { path: "/Login", element: <Login /> },
      { path: "/Principal", element: <Principal /> },
      { path: "/Cadastro", element: <Cadastro /> },
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
