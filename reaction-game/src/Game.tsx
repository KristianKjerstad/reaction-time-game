import React, { useState, useRef, useEffect } from 'react';

const ReactionTimeGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [averageReactionTime, setAverageReactionTime] = useState<number | null>(null);
  const [showX, setShowX] = useState<boolean | null>(null);
  const gameBoxRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameStarted) {
      generateXOrO();
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setErrorCount(0);
    setReactionTimes([]);
    setAverageReactionTime(null);
  };

  const generateXOrO = () => {
    setShowX(Math.random() < 0.5); // 50% chance of X, 50% chance of O
    startTimeRef.current = Date.now();
    //@ts-ignore
    timeoutRef.current = setTimeout(() => {
      if (gameStarted) {
        setShowX(null); // Reset to blank
            //@ts-ignore
        timeoutRef.current = setTimeout(() => {
          console.log("show x", Math.random() < 0.5)
          if (gameStarted && showX === true) {
            setErrorCount(errorCount + 1);
          }
          generateXOrO();
        }, 1000); // Wait for 1 second between X and O
      }
    }, 2000); // X or O appears for 2 seconds
  };

  const handleButtonClick = () => {
    if (!gameStarted) {
      startGame();
    }
  };

  const handleGameBoxClick = () => {
    if (gameStarted && showX !== null) {
          //@ts-ignore
      clearTimeout(timeoutRef.current);
      const reactionTime = Date.now() - (startTimeRef.current || 0);
      setReactionTimes([...reactionTimes, reactionTime]);
      const newAverage =
        (reactionTimes.reduce((acc, time) => acc + time, reactionTime) + reactionTime) /
        (reactionTimes.length + 1);
      setAverageReactionTime(newAverage);
      setShowX(null); // Reset to blank
          //@ts-ignore
      timeoutRef.current = setTimeout(() => {
        if (gameStarted) {
          generateXOrO();
        }
      }, 1000); // Wait for 1 second before the next X or O
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
        {gameStarted && showX !== null && (showX ? 'X' : 'O')}
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
