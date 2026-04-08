import { useState, useEffect } from "react";
import Button from "./Buttons/button";
import styles from "./Quiz.module.css";
import { decode } from "html-entities";
import { shuffleArr } from "../utils/helper";

export default function Quiz() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form submit data
  const submitForm = (event) => {
    setIsSubmitted(true);
    event.preventDefault();
  };

  // Set up click event
  const handleChange = (answer, question) =>
    setQuizAnswers({
      ...quizAnswers,
      [question]: answer,
    });

  const resetQuiz = () => {
    setQuizQuestions([]);
    setQuizAnswers({});
    setIsSubmitted(false);
    fetchData();
  };

  const cleanUpData = (obj) => ({
    ...obj,
    question: decode(obj.question),
    correct_answer: decode(obj.correct_answer),
    incorrect_answers: obj.incorrect_answers.map((answer) => decode(answer)),
    answers: shuffleArr([
      obj.correct_answer,
      ...obj.incorrect_answers.map((answer) => decode(answer)),
    ]),
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`https://opentdb.com/api.php?amount=5`);

      if (!res.ok) {
        throw new Error("Not found");
      }

      const data = await res.json();
      const mappedData = data.results.map((item) => cleanUpData(item));

      setQuizQuestions(mappedData);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Initializing data
  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    console.error("Too many requests");
  }

  if (isLoading) {
    return <h1 style={{ textAlign: "center" }}>Fetching Data</h1>;
  }

  // Checks styling of label
  const labelStyle = (correctAnswer, guess) =>
    correctAnswer === guess
      ? `${styles["labelInput"]} ${styles["correct"]}`
      : `${styles["labelInput"]} ${styles["wrong"]}`;

  // Gets correct number of guess
  const correctGuesses = () =>
    quizQuestions.filter(
      (item) => item.correct_answer === quizAnswers[item.question],
    ).length;

  const quizData = quizQuestions.map((item) => (
    <fieldset className={styles.quizQuestion} key={item.question}>
      <p className={styles.title}>{item.question}</p>
      <div className={styles.answerContainer}>
        {item.answers.map((answer, index) => (
          <label
            className={
              isSubmitted
                ? labelStyle(item.correct_answer, answer)
                : styles["labelInput"]
            }
            key={answer}
          >
            {answer}
            <input
              type="radio"
              value={answer}
              className={styles.radioInput}
              name={item.question}
              checked={quizAnswers[item.question] === answer}
              onChange={() => handleChange(answer, item.question)}
              disabled={isSubmitted}
            />
          </label>
        ))}
      </div>
    </fieldset>
  ));

  return (
    <div className={styles.quizContainer}>
      <form className={styles.quizForm} onSubmit={submitForm}>
        {quizData}
        {!isSubmitted && (
          <div className={styles.btnContainer}>
            {!isLoading && (
              <Button text="Submit Answers" isHomeButton={false} />
            )}
          </div>
        )}
      </form>
      {isSubmitted && (
        <div className={styles.compContainer}>
          <p className={styles.correctGuess}>
            You scored {correctGuesses()}/{quizQuestions.length} correct
          </p>
          <Button
            text="retry quiz"
            clickHand={resetQuiz}
            isHomeButton={false}
          />
        </div>
      )}
    </div>
  );
}
