import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Tenzies</h1>
      <p className={styles.secondaryText}>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
    </header>
  );
}
