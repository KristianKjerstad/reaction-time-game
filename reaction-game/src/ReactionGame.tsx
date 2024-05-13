import React, { useState, useRef, useEffect, useMemo } from 'react';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ReactionGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [timeStarted, setTimeStarted] = useState<number >(0)
  const averageReactionTime = useMemo(() => {
    if (reactionTimes.length === 0) {
        return 0
    }
    const sum = reactionTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / reactionTimes.length;
    return average.toFixed(1)
}, [reactionTimes])
  const [showX, setShowX] = useState<boolean | null>(null);
  const gameBoxRef = useRef<HTMLDivElement | null>(null);

  const startGame = async () => {
    setGameStarted(true);
    setErrorCount(0);
    setReactionTimes([]);
    await sleep(2000)
    while (true) {
        await gameLoop()
    }
  };


  const gameLoop = async () => {
    const timeToSleepInMS = 2000
    setXOrO()
    await sleep(timeToSleepInMS)
    setShowX(null)
    await sleep(timeToSleepInMS)
  }

  const setXOrO = () => {
    const willShowX =  Math.random() <= 0.5
    if (willShowX) {
        setShowX(true)
    }   
    else {
        setShowX(false)
    }
    setTimeStarted(Date.now())
  };

  const handleButtonClick = () => {
    if (!gameStarted) {
      startGame();
    }
  };

  const handleGameBoxClick = () => {
        if (gameStarted && showX !== null) {
            if (showX === true) {
                setErrorCount(errorCount + 1)
            }
            else {
                setReactionTimes([...reactionTimes, Date.now() - timeStarted])
            }
        }
  };

  return (
    <div>
        <h1> Reaction time game</h1>
        <p> Click on "O" when they appear, if you click on "X" the error count is increased.</p>
        <p>The chance of getting X and O is 50/50</p>
        <p>Refresh the page to start a new game.</p>
      <div
        ref={gameBoxRef}
        style={{
          cursor: "pointer", 
          paddingTop: "40px",
          width: '300px',
          height: '300px',
          border: '1px solid black',
          alignItems: 'center', 
          textAlign: "center",
          fontSize: "200px"
        }}
        onClick={handleGameBoxClick}
      >
        {gameStarted && showX !== null && (showX ? 'X' : 'O')}
      </div>
      {!gameStarted && <button onClick={handleButtonClick}>{gameStarted ? 'Game in Progress' : 'Start Game'}</button>}
      <div style={{fontSize: "24px", padding: "12px"}}>Error Count: {errorCount}</div>
      <div style={{fontSize: "24px", padding: "12px"}}>
        Reaction Times:{' '}
        {reactionTimes.map((time, index) => (
          <span key={index}>{time}ms, </span>
        ))}
      </div>
      <div style={{fontSize: "24px", padding: "12px"}}>Average Reaction Time: {averageReactionTime}ms</div>
    </div>
  );
};

export default ReactionGame;
