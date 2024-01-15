import React, { useState, useRef } from 'react';

const ReactionTimeGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [averageReactionTime, setAverageReactionTime] = useState<number | null>(null);
  const [showX, setShowX] = useState<boolean>(false);
  const gameBoxRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startGame = () => {
    setGameStarted(true);
    setErrorCount(0);
    setReactionTimes([]);
    setAverageReactionTime(null);
    generateXOrO();
  };

  const generateXOrO = () => {
    setShowX(Math.random() < 0.5);
    if (gameStarted) {
      startTimeRef.current = Date.now();
      setTimeout(() => {
        if (gameStarted) {
          if (showX) {
            setErrorCount(errorCount + 1);
          } else {
            const reactionTime = Date.now() - (startTimeRef.current || 0);
            setReactionTimes([...reactionTimes, reactionTime]);
            const newAverage =
              (reactionTimes.reduce((acc, time) => acc + time, reactionTime) + reactionTime) /
              (reactionTimes.length + 1);
            setAverageReactionTime(newAverage);
          }
          generateXOrO();
        }
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleButtonClick = () => {
    if (!gameStarted) {
      startGame();
    }
  };

  const handleGameBoxClick = () => {
    if (gameStarted && showX) {
      const reactionTime = Date.now() - (startTimeRef.current || 0);
      setReactionTimes([...reactionTimes, reactionTime]);
      const newAverage =
        (reactionTimes.reduce((acc, time) => acc + time, reactionTime) + reactionTime) /
        (reactionTimes.length + 1);
      setAverageReactionTime(newAverage);
      generateXOrO();
    }
  };

  const handleXOrOClick = () => {
    if (gameStarted && !showX) {
      setErrorCount(errorCount + 1);
      generateXOrO();
    }
  };

  return (
    <div>
      <div
        ref={gameBoxRef}
        style={{
          width: '200px',
          height: '200px',
          border: '1px solid black',
          position: 'relative',
        }}
        onClick={handleGameBoxClick}
      >
        {gameStarted && (showX ? 'X' : 'O')}
      </div>
      <button onClick={handleButtonClick}>{gameStarted ? 'Game in Progress' : 'Start Game'}</button>
      <div>Error Count: {errorCount}</div>
      <div>
        Reaction Times:{' '}
        {reactionTimes.map((time, index) => (
          <span key={index}>{time}ms, </span>
        ))}
      </div>
      <div>Average Reaction Time: {averageReactionTime}ms</div>
    </div>
  );
};

export default ReactionTimeGame;
