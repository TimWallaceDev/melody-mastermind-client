import React, { useState, useEffect, useRef } from 'react';

const MusicVisualizer = ({ audioUrl }) => {
    console.log(audioUrl)
    const [audioData, setAudioData] = useState(null);
    const canvasRef = useRef(null);
    const newAudio = new Audio()
    newAudio.crossOrigin = "anonymous"
    newAudio.src = audioUrl
    const audioRef = useRef(newAudio);
    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const analyserRef = useRef(audioContextRef.current.createAnalyser());
    const dataArrayRef = useRef(null);
    const animationRef = useRef(null);
    console.log("visualizer rendered")

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const audio = audioRef.current;
        const audioContext = audioContextRef.current;
        const analyser = analyserRef.current;

        // Connect the audio source to the analyser node
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // Set the size of the analyser
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        const draw = () => {
            // Get frequency data
            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw visualizer
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
                x += barWidth + 1;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        // Start drawing
        draw();

        // Cleanup on unmount
        return () => {
            cancelAnimationFrame(animationRef.current);
            audio.pause();
            audioContext.close();
        };
    }, [audioUrl]);

    useEffect(() => {
        const audio = audioRef.current;

        // Load and play audio
        audio.load();
        audio.play().catch(err => console.error('Failed to play audio:', err));

        // Pause audio when component unmounts
        return () => audio.pause();
    }, []);

    return <canvas ref={canvasRef} />;
};

export {MusicVisualizer};