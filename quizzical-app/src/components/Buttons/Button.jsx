import styles from "./Button.module.css";

export default function Button(props) {
  return (
    <button
      onClick={props.startGame}
      className={
        props.isHomeButton ? `${styles.btn} ${styles.home}` : `${styles.btn} ${styles.quiz}`
      }
    >
      {props.text}
    </button>
  );
}
