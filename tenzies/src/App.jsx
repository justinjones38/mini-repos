import styles from "./App.module.css";
import { getDiceValues } from "./utils/helper";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";

import Header from "./components/Header.jsx";
import Die from "./components/Die.jsx";

export default function App() {
  const [dice, setDice] = useState(() => getDiceValues());
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: innerWidth,
  });

  const refButton = useRef(null);

  // Toggle
  const toggleDice = (id) =>
    setDice((prevDice) =>
      prevDice.map((prevDie) =>
        prevDie.id === id ? { ...prevDie, isHeld: !prevDie.isHeld } : prevDie,
      ),
    );

  const rollDice = () =>
    setDice((prevDice) =>
      prevDice.map((prevDie) =>
        prevDie.isHeld
          ? prevDie
          : { ...prevDie, value: Math.ceil(Math.random() * 6) },
      ),
    );

  const isGameWon = dice.every(
    (die) => die.isHeld && die.value === dice[0].value,
  );

  const startNewGame = () => setDice(getDiceValues());

  useEffect(() => {
    const getDimensions = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", getDimensions);
  }, []);

  useEffect(() => {
    if (isGameWon) {
      refButton.current.focus();
    }
  }, [isGameWon]);

  return (
    <div className={styles.container}>
      <Header />
      {isGameWon ? (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      ) : null}
      <div className={styles.dieContainer}>
        {dice.map((die) => (
          <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            toggleDice={toggleDice}
            id={die.id}
          />
        ))}
      </div>
      <button
        className={styles.primaryButton}
        onClick={isGameWon ? startNewGame : rollDice}
        ref={refButton}
      >
        {isGameWon ? "New Game" : "Roll"}
      </button>
    </div>
  );
}
