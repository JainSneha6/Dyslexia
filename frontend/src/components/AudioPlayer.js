import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ audio }) => {
    const audioRef = useRef(null);
    const volumeLevel = 0.5; 

    useEffect(() => {
        const playAudio = async () => {
            try {
                audioRef.current.volume = volumeLevel; 
                await audioRef.current.play();
            } catch (error) {
                console.error('Error playing audio:', error);
            }
        };

        playAudio();

        return () => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; 
        };
    }, [audio]); 

    return (
        <div>
            <audio ref={audioRef} src={audio} loop />
        </div>
    );
};

export default AudioPlayer;
