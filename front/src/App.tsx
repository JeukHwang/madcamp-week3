import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,Routes, Link } from "react-router-dom";
import Home from './pages/home/home';
import Main from './pages/main/main';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/main" element={<Main/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
