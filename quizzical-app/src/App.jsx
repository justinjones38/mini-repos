import { useState } from "react";
import styles from "./App.module.css";
import Home from "./components/Home";
import Quiz from "./components/Quiz";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const startGame = () => {
    setGameStarted(true);
  };

  return gameStarted ? <Quiz /> : <Home startGame={startGame} />;
}
