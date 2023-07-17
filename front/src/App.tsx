import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,Routes, Link } from "react-router-dom";
import Home from './pages/home/home';
import Main from './pages/main/main';
import LeaderBoard from './pages/leaderboard/leaderboard';
import Ready from './pages/ready/ready';
import Setting from './pages/setting/setting';
//import TodoList from './pages/example/example';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/main" element={<Main/>} />
      <Route path="/board" element={<LeaderBoard/>} />
      <Route path="/ready" element={<Ready/>} />
      <Route path="/setting" element={<Setting/>} />
      
   </Routes>
    </BrowserRouter>
    
  );
}

export default App;
