import './App.css';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from './pages/home/home';
import Main from './pages/main/main';
import LeaderBoard from './pages/leaderboard/leaderboard';
import Ready from './pages/ready/ready';
import Setting from './pages/setting/setting';
import { useAtom } from "jotai";
import { soundAtom } from './utils/atom';
import { useEffect } from 'react';

function App() {
  const [sound, setSound] = useAtom(soundAtom);

  // Function to handle the audio play and pause based on the 'sound' atom value
  const handleAudio = () => {
    const audioElement = document.getElementById("audio-element") as HTMLAudioElement;

    if (audioElement) {
      if (sound === 1) {
        // Play the audio
        audioElement.play();
      } else if (sound === 0) {
        // Pause the audio
        audioElement.pause();
      }
    }
  };

  useEffect(() => {
    handleAudio();
  }, [sound]);

  return (
    
    <BrowserRouter>
    
      {/* Add 'id' to the audio element */}
      <audio id="audio-element" src="https://madcamp-week3-front.up.railway.app/mysteriousSmell.mp3" muted autoPlay loop preload="auto" controls>
      </audio>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/board" element={<LeaderBoard />} />
        <Route path="/ready" element={<Ready />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
