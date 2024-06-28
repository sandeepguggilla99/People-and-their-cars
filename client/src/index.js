import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApolloClientProvider from "./ApolloClient";
import Home from "./pages/Home";
import PersonDetail from "./pages/PersonDetail";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

/* This code snippet is using React to render a component tree into the DOM. */
root.render(
  <ApolloClientProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/people/:id" element={<PersonDetail />} />
      </Routes>
    </Router>
  </ApolloClientProvider>
);
