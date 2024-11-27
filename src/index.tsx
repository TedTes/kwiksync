import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Navbar from "./web/components/Navbar";
import Inventory from "./web/pages/Inventory";
import Trends from "./web/pages/Trends";

function App(): JSX.Element {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/trends" element={<Trends />} />
      </Routes>
    </Router>
  );
}

export default App;
