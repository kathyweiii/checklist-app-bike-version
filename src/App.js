import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import HomePage from "./containers/HomePage";
import CheckList from "./containers/CheckList";
import Result from "./containers/Result";
import OutputList from "./containers/OutputList";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/checklist" element={<CheckList />} />
        <Route path="/result" element={<Result />} />
        <Route path="/outputlist" element={<OutputList />} />
      </Routes>
    </Router>
  );
}

export default App;
