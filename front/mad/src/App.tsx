import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,Routes, Link } from "react-router-dom";
import Home from './pages/home/home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
