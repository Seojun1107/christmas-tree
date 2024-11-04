import React, { useEffect, useRef } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/background.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.log('음악 자동 재생 실패:', error);
      }
    };

    playAudio();

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  return null;
};

export default BackgroundMusic;