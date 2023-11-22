import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Box, ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
document.querySelector("html").style.minHeight = "100%";
document.querySelector("body").style.minHeight = "100vh";
document.getElementById("root").style.minHeight = "100vh";

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Box
        minHeight={"100vh"}
        bgGradient={[
          "linear(to-tr, teal.300, yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.300)",
        ]}
      >
        <App />
      </Box>
    </ChakraProvider>
  </React.StrictMode>,
);
