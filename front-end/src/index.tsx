import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { RegisterPage, LoginPage, FeedPage, ProfilePage } from "./pages";
import { ErrorBoundary } from "./components";
const theme = createTheme();

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <LoginPage />
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
);
