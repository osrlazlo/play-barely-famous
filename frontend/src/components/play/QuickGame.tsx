import { useParams } from "react-router";
import { CategoryContext, ThemeContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { getCategories } from "../../../../api/functions/getCategories";
import { formatDateAdded } from "../CategoryCard";
import type { GuessResult, Category } from "../interfaces";
import "./game.css"
import { calculateScore, checkGuess } from "./helpers"
import SelectAmount from "./utils/SelectAmount";
import TopAnswers from "./TopAnswers";
import { Hints } from "./MultiRoundGame";
import PreviousGuesses from "./PreviousGuess";
import ButtonWrapper from "./utils/ButtonWrapper";
import Header from "../utils/Header";
import ErrorBoundary from "../../ErrorBoundary";
import Footer from "../utils/Footer";

export default function QuickGameWrapper() {
    return(
        <>
        <Header/>
        <ErrorBoundary fallback={'Failed to load categories'}>
            <QuickGame/>
        </ErrorBoundary>
        <Footer/>
        </>
        
    )
}

function QuickGame() {
    const params = useParams()
    const {categories,setCategories} = useContext(CategoryContext)
    const [category, setCategory] = useState<Category>()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [guesses, setGuesses] = useState<GuessResult[]>([])
    const [guess, setGuess] = useState("")
    const [errorMsg, setErrorMsg] = useState(<></>)
    const [showTopAnswers, setShowTopAnswers] = useState(false)

    const minGuess = 4; const maxGuess = 10
    const [guessAmt, setGuessAmt] = useState(minGuess)
    const {theme} = useContext(ThemeContext)
    const [error, setError] = useState<Error|null>(null)

    //load categories if not loaded yet 
    useEffect(() => {
        async function loadCategories() {
            const res = await getCategories()
            try {
                if (res.status == 200) {
                    let categories = res.data.categories as Category[]
                    setCategories(categories)
                    setCategory(categories.find(c => Number(c.id) === Number(params.id)))
                } 
                else setError(new Error(`{"status": "${res.status}", "msg": "${res.msg}"}`)) 
                
            } catch (error) {
                setError(error as Error)
            } 
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
            //if (category) console.log(category)
        }
        function endGame() {
            setIsGameOver(true)
            //setShowTopAnswers(true)
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

    function toggleTopAnswers() {
        setShowTopAnswers(t => !t)
    }

    if (error) throw error
    return(
        <>
        <div className="screen">
            <div className="game-screen">
                { category ?
                <div className="full-header">
                    <div className="game-header">
                        <div className="category">
                            <div className="title">{category.name}</div>
                            <div className="source">Source: {category.source}</div>
                            <div className="updated">Updated: {formatDateAdded(category.dateUpdated)}</div>
                        </div>
        
                        { !isPlaying && category ?
                        <div className="select-options">
                            <SelectAmount name="guesses" value={guessAmt} min={minGuess} max={maxGuess} setValue={setGuessAmt}/>
                            <ButtonWrapper>
                            <button className="start-game-button"
                                onClick={() => startGame()}>START GAME</button>
                            </ButtonWrapper>         
                        </div>:"" }  
                    </div>
                    { isGameOver && !showTopAnswers ? 
                        <ButtonWrapper>
                            <button id="show-top-answers-button"
                            onClick={() => toggleTopAnswers()}>Show Top Answers</button>
                        </ButtonWrapper>
                        :""}
                    { showTopAnswers && category ? 
                        <TopAnswers category={category}/>:""}  

                </div>:"" }

                { !isPlaying && category ?
                    <div className="select-and-hints">
                    <Hints/>
                    </div>:"" }

                { isPlaying ? 
                    <div className="guesses-container">
                        <div className="score">Your score: {calculateScore(guesses)}</div>
                        <div className={"guess-remaining"+theme}>
                            <div className={"num"+theme}> {guessAmt}</div> guess(es) left</div>
                        
                        { !isGameOver ? 
                            
                            <><form id="submit-guess" onSubmit={(e) => enterGuess(e)}>
                                <label>Enter a guess</label>
                                {errorMsg ? <div className="error-msg">{errorMsg}</div>:""}
                                <div id={errorMsg.key ? "input-error":""}>
                                    <input type="text" placeholder="enter a guess" required id={ errorMsg ? "input-error":""}
                                        className={"guess-input" + theme} value={guess} onChange={e => setGuess(e.target.value)}>
                                    </input>
                                </div>
                                <ButtonWrapper>
                                    <button type="submit" id="enter-guess-button">GUESS</button>  
                                </ButtonWrapper>  
                            </form></>:""}

                        { isGameOver ? 
                            <ButtonWrapper>
                            <button className="reset-game-button"
                            onClick={() => resetGame()}>Reset</button>  
                            </ButtonWrapper>
                            :""}

                    </div>:""}

                { isPlaying && guesses ? 
                    <div className={'quick-game-guesses'+theme}>
                    <div className="previous-guesses">
                        {guesses.length > 0 ? <PreviousGuesses guesses={guesses}/>:<h3>Enter a guess</h3>}
                    </div>
                    </div>:""}
            </div>
        </div>
        </>
    )
}