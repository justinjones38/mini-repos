import styles from "./Home.module.css"
import Button from "./Buttons/Button.jsx"
export default function Home(props) {
    console.log(<Button />)
    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Quizzical</h1>
            <p className={styles.description}>A quiz about everything in the world</p>
            <Button text="Start Quiz" startGame={props.startGame} isHomeButton={true} />
        </div>
    )
}