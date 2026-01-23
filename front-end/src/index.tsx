import React from "react";
import ReactDOM from "react-dom/client";
import { RegisterPage } from "./pages";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RegisterPage />
  </React.StrictMode>,
);
