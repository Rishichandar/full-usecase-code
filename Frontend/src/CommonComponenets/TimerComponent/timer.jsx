import React from 'react';
import {  useSelector } from 'react-redux';

function Timer() {
    const currentTimer= useSelector((state)=>state.timerState.currentTimer)
    
    return (
        <div>
            <h1>{formatTime(currentTimer)}</h1>
        </div>
    );
}

// Helper function to format time in seconds into H:MM:SS
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    return `${hours}:${pad(minutes)}:${pad(secondsLeft)}`;
}

// Adds leading zero to numbers less than 10
function pad(value) {
    return String(value).padStart(2, '0');
}

export default Timer;
