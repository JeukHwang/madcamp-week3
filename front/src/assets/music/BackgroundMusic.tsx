import React, { useState } from "react";
import ReactAudioPlayer from "react-audio-player";

const BackgroundMusic = () => {
  const [musicLoaded, setMusicLoaded] = useState(false);

  const handlePlayMusic = () => {
    const audio = new Audio("front/public/mysteriousSmell.mp3"); // 절대 경로 사용
    audio.volume = 0.2;
    audio.loop = true;
    audio.play();
    setMusicLoaded(true);
  };

  // Render a button to start the music
  if (!musicLoaded) {
    return (
      <div>
        <button onClick={handlePlayMusic}>Play Background Music</button>
        <ReactAudioPlayer
          src="front/public/mysteriousSmell.mp3" // 절대 경로 사용
          autoPlay
          controls
        />
      </div>
    );
  }

  return null; // If music is already loaded, don't render anything
};

export default BackgroundMusic;
