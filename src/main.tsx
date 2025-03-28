import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import App from "./App";

const rootElement = document.querySelector("#root");
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <Toaster />
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </React.StrictMode>,
);
