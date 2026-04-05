import styles from "./Die.module.css";

export default function Die(props) {
  return (
    <button
      className={
        props.isHeld
          ? `${styles.dieNumber} ${styles.held}`
          : `${styles.dieNumber}`
      }
      onClick={() => props.toggleDice(props.id)}
    >
      {props.value}
    </button>
  );
}
