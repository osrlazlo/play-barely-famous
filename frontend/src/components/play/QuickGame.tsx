import { useParams } from "react-router";
import { CategoryContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { getCategories } from "../../../../api/functions/getCategories";
import { formatDateAdded } from "../CategoryCard";
import type { GuessResult, Category } from "./interfaces";
import PreviousGuess from "./PreviousGuess";
import "./game.css"
import BackHomeButton from "../utils/BackHomeButtom";
import { calculateScore, checkGuess } from "./helpers"
import SelectAmount from "./utils/SelectAmount";
import { isMatch } from "./matchPercentage";
import TopAnswers from "./TopAnswers";
import { Hints } from "./MultiRoundGame";

export default function GameScreen() {
    const params = useParams()
    const {categories} = useContext(CategoryContext)
    const [category, setCategory] = useState<Category>()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [guesses, setGuesses] = useState<GuessResult[]>([])
    const [guess, setGuess] = useState("")
    const [errorMsg, setErrorMsg] = useState(<></>)
    const [showTopAnswers, setShowTopAnswers] = useState(false)

    const minGuess = 4; const maxGuess = 10
    const [guessAmt, setGuessAmt] = useState(minGuess)

    //load categories if not loaded yet
    useEffect(() => {
        async function loadCategories() {
            const categories = await getCategories()
             setCategory(categories.find(c => Number(c.id) === Number(params.id)))
        }

        if (categories.length > 0)
            setCategory(categories.find(c => Number(c.id) === Number(params.id)))
        else loadCategories()
    },[])

    useEffect(() => {
        if (guessAmt == 0) endGame()
    }, [guessAmt])

    //start game
        function startGame() {
            setIsPlaying(true)
        }
        function endGame() {
            setIsGameOver(true)
            setShowTopAnswers(true)
        }
    
    //reset game
        function resetGame() {
            setIsPlaying(false)
            setIsGameOver(false)
            setShowTopAnswers(false)
            setGuesses([])
            setGuessAmt(4)
        }
    
    //enter a guess
        function enterGuess(e:React.FormEvent) {
            e.preventDefault()
            if (!guess || !category) return
            let guessResult = checkGuess(guess, category)!
            if (guesses.find(g =>  g.guess == guessResult.guess || g.attempt == guessResult.guess)) {
                setErrorMsg(
                        <p>Already guessed "{guessResult.guess}"
                        <br/>You may need to try again with more precision</p>
                )
                return
            }
            if (errorMsg) setErrorMsg(<></>)
            setGuesses(g => [guessResult!, ...g])
            setGuess("")
            setGuessAmt(g => g-1)
        }

    return(
        <div className="screen">
        <BackHomeButton/>
        <div className="game-screen">
        { category ?
        <div className="full-header">
            <div className="game-header">
                <div className="category">
                    <div className="title">{category.name}</div>
                    <div className="source">Source: {category.source}</div>
                    <div className="updated">Updated: {formatDateAdded(category.dateAdded)}</div>
                </div>
            </div>
            { showTopAnswers && category ? 
            <TopAnswers category={category}/>:""}    
        </div>:"" }

        { !isPlaying && category ?
            <div className="select-and-hints">
            <div className="select-options">
                <SelectAmount name="guesses" value={guessAmt} min={minGuess} max={maxGuess} setValue={setGuessAmt}/>
                <button className="start-game-button"
                    onClick={() => startGame()}>START GAME</button>         
            </div>
            <Hints/>
            </div>:"" }

        { isPlaying ? 
            <div className="guesses-container">
                <div className="score">Your score: {calculateScore(guesses)}</div>
                <div className="guess-remaining">
                    <div className="num"> {guessAmt}</div> guess(es) left</div>
                
                { !isGameOver ? 
                    
                    <><form id="submit-guess" onSubmit={(e) => enterGuess(e)}>
                        <label>Enter a guess</label>
                        {errorMsg ? <div className="error-msg">{errorMsg}</div>:""}
                        <div id={errorMsg.key ? "input-error":""}>
                            <input type="text" placeholder="enter a guess" required id={ errorMsg ? "input-error":""}
                                value={guess} onChange={e => setGuess(e.target.value)}>
                            </input>
                        </div>
                        <button type="submit" id="enter-guess-button">GUESS</button>
                    </form></>:""}

                { isGameOver ? <button className="reset-game-button"
                    onClick={() => resetGame()}>Reset</button>:""}

            </div>:""}

        { isPlaying && guesses ? 
            <div className="previous-guesses">
                {guesses.map(g => <PreviousGuess 
                    key={g.guess} guess={g.guess} isValid={g.isValid} points={g.points} attempt=""/>)}
            </div>:""}

        </div>
        </div>
    )
}