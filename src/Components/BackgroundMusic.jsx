import React, { useEffect, useRef } from 'react';

const BackgroundMusic = ({ isPlaying }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('/background.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const playAudio = async () => {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.log('음악 자동 재생 실패:', error);
        }
      };
      playAudio();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  return null;
};

export default BackgroundMusic;