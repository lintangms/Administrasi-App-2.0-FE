import React from "react";
import ReactDOM from "react-dom/client"; // Pastikan Anda menggunakan 'react-dom/client'
import { BrowserRouter } from "react-router-dom"; // Impor BrowserRouter
import App from "./App";
import "./index.css";

// Cari elemen root di dalam file HTML Anda
const root = ReactDOM.createRoot(document.getElementById("root"));

// Gunakan createRoot untuk merender aplikasi Anda
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Hanya gunakan BrowserRouter di sini */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);