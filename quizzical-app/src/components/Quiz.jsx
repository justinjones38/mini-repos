import { useState, useEffect } from "react";
import Button from "./Buttons/button";
import styles from "./Quiz.module.css";
import { decode } from "html-entities";

export default function Quiz() {
  const [quizQuestions, setQuizQuestions] = useState([]);
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
      setIsSubmitted(false)
      fetchData();
    }

  const fetchData = async () => {
    try {
      const res = await fetch(`https://opentdb.com/api.php?amount=5`);

      if (!res.ok) {
        throw new Error("Not found");
      }

      const data = await res.json();
      const mappedData = data.results.map((item) => {
        // Decoding necessary items for the quiz
        item.question = decode(item.question);
        item.correct_answer = decode(item.correct_answer);
        item.incorrect_answers.forEach((answer, index) => {
          item.incorrect_answers[index] = decode(answer);
        });

        item.answers = [item.correct_answer, ...item.incorrect_answers];

        for (let index = item.answers.length - 1; index > 0; index--) {
          let randomIndex = Math.floor(Math.random() * index);
          [item.answers[index], item.answers[randomIndex]] = [
            item.answers[randomIndex],
            item.answers[index],
          ];
        }
        return item;
      });

      setQuizQuestions(mappedData);
    } catch (err) {
      setError(true);
    }
  };

  // Initializing data
  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    console.log("Too many requests");
  }

  const labelStyle = (correctAnswer, guess) => {
    if (isSubmitted && correctAnswer === guess) {
      return `${styles["labelInput"]} ${styles["correct"]}`;
    } else if (isSubmitted && correctAnswer !== guess) {
      return `${styles["labelInput"]} ${styles["wrong"]}`;
    } else {
      return `${styles["labelInput"]}`;
    }
  };

  const correctGuesses = () => {
    let guess = 0;
    quizQuestions.map(item => {
      if(item.correct_answer === quizAnswers[item.question]) {
        guess++
      }
    })
    return guess;
  }

  const quizData = quizQuestions.map((item) => (
    <fieldset className={styles.quizQuestion} key={item.question}>
      <p className={styles.title}>{item.question}</p>
      <div className={styles.answerContainer}>
        {item.answers.map((answer, index) => (
          <label
            className={labelStyle(item.correct_answer, answer)}
            key={index}
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
            <Button text="Submit Answers" isHomeButton={false} />
          </div>
        )}
      </form>
      {isSubmitted && (
        <div className={styles.compContainer}>
          <p className={styles.correctGuess}>You scored {correctGuesses()}/{quizQuestions.length} correct</p>
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
