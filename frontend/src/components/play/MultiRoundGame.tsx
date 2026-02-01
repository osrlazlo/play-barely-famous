import { CategoryContext, ThemeContext } from "../../App";
import React, { useContext, useEffect, useState, type ReactElement } from "react";
import { getCategories } from "../../../../api/functions/getCategories";
import { formatDateAdded } from "../CategoryCard";
import type { GuessResult, Category, Team } from "./interfaces";
import "./game.css"
import { checkGuess, createTeams, findWinnerIndex, getRandomInt, shuffleArray } from "./helpers";
import SelectAmount from "./utils/SelectAmount";
import TeamCard from "./TeamCard";
import TopAnswers from "./TopAnswers";
import ButtonWrapper from "./utils/ButtonWrapper";
import Header from "../utils/Header";
import ErrorBoundary from "../../ErrorBoundary";

export default function MultiRoundGameWrapper() {
    return(
        <>
        <Header/>
        <div className="screen">
            <ErrorBoundary fallback="Failed to load categories">
                <MultiRoundGame/>
            </ErrorBoundary>
        </div>
        </>
    )
}

function MultiRoundGame() {

    const categoriesFromContext = useContext(CategoryContext)
    const [categories, setCategories] = useState([...categoriesFromContext.categories])
    
    const [randomCategories, setRandomCategories] = useState<Category[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isRoundOver, setIsRoundOver] = useState(false)
    const [guesses, setGuesses] = useState<GuessResult[]>([])
    const [guess, setGuess] = useState("")
    const [errorMsg, setErrorMsg] = useState<ReactElement|null>(null)
    const [showTopAnswers, setShowTopAnswers] = useState(false)

    const minGuess = 1; const maxGuess = 10
    const [guessAmt, setGuessAmt] = useState(minGuess)
    const [guessReset, setGuessReset] = useState(0)
    const minTeams = 1; const maxTeams = 3
    const [teamsAmt, setTeamsAmt] = useState(minTeams)
    const minRounds = 1; const maxRounds = 3
    const [roundsAmt, setRoundsAmt] = useState(minRounds)
    const [currentRound, setCurrentRound] = useState(minRounds)
    const [teams, setTeams] = useState<Team[]>([])
    const [currentTeam, setCurrentTeam] = useState(0)
    const [currentCategory, setCurrentCategory] = useState(0)

    const [error, setError] = useState<Error|null>(null)
    //load categories if not loaded yet
    useEffect(() => {
        async function loadCategories() {
            const res = await getCategories()
            try {
                if (res.status == 200) {
                    let categories = res.data as Category[]
                    setCategories(categories)
                } 
                else setError(new Error(`{"status": "${res.status}", "msg": "${res.msg}"}`)) 
                
            } catch (error) {
                setError(error as Error)
            } 
        }
        if (!(categories.length > 0)) loadCategories()
    },[])

    useEffect(() => {
        if (guessAmt == 0) {
            if (currentRound == roundsAmt) endGame()
            else if (currentRound < roundsAmt) {
                setIsRoundOver(true)
                //setShowTopAnswers(true)
            }
            teams.map(t => t.isCurrentTeam = false)
        }    
    }, [guessAmt])

    //start game
        function startGame() {
            setIsPlaying(true)
            setGuessAmt(g => g*teamsAmt)
            let randomCategories = getGandomCategories()
            //console.log("random",randomCategories)
            setRandomCategories(randomCategories)
            let teams = createTeams(teamsAmt)
            setTeams(teams)
            setGuessReset(guessAmt*teamsAmt)
            teams[0].isCurrentTeam = true
        }
        function endGame() {
            setIsGameOver(true)
            //setShowTopAnswers(true)
            setIsRoundOver(true)
            if (teamsAmt > 1) {
                let winner = findWinnerIndex(teams)
                teams[winner].isWinner = true
            }
        }
    
    //reset game
        function resetGame() {
            setIsPlaying(false)
            setIsGameOver(false)
            setShowTopAnswers(false)
            setIsRoundOver(false)
            setGuesses([])
            setGuessAmt(minGuess)
        }
    
    //enter a guess
        function enterGuess(e:React.FormEvent) {
            e.preventDefault()
            if (!guess) return
            let guessResult = checkGuess(guess, randomCategories[currentCategory])!
            if (guesses.find(g =>  g.guess == guessResult.guess || g.attempt == guessResult.guess)) {
                setErrorMsg(<ErrorMsg guess={guessResult.guess}/>)
                return
            }
            if (errorMsg) setErrorMsg(null)
                
            setGuesses(g => [guessResult, ...g])
            teams[currentTeam].guesses = [guessResult, ...teams[currentTeam].guesses]
            teams[currentTeam].score = teams[currentTeam].score+(guessResult.points  > 100 ? 0:guessResult.points)
            setGuess("")
            nextTeam()
            setGuessAmt(g => g-1)
        }

        function nextTeam() {
            teams.map(t => t.isCurrentTeam = false)
            if (currentTeam == teams.length-1) {
                setCurrentTeam(0)
                if (!isGameOver) teams[0].isCurrentTeam = true
            }
            else {
                setCurrentTeam(t => t+1)
                if (!isGameOver) teams[currentTeam+1].isCurrentTeam = true
            }
        }

        function nextRound() {
            setGuessAmt(guessReset)
            setIsRoundOver(false)
            setCurrentRound(r => r+1)
            setCurrentCategory(c => c+1)
            teams.map(t => 
                {t.score = t.score
                t.guesses = []})
            teams[0].isCurrentTeam = true
            setShowTopAnswers(false)
        }

    //select random category
        function getGandomCategories() {
            let randomCategories:Category[] = []
            let choseFrom = [...categories]
            shuffleArray(choseFrom)
            for (let i=0; i<roundsAmt; i++) {
                let randomIndex = getRandomInt(0,choseFrom.length)
                randomCategories.push(choseFrom[randomIndex])
                choseFrom = (choseFrom.filter(unselected => !randomCategories.find(selected => unselected.id == selected.id))
                )
            }
            return randomCategories
        }

        function toggleTopAnswers() {
            setShowTopAnswers(t => !t)
        }

        const {theme} = useContext(ThemeContext)

    if (error) throw error
    return(
        <div className="screen">
        
        <div className="game-screen">
            
            { !isPlaying && categories ?
                <div className="select-and-hints">
                <div className="select-options">
                    <SelectAmount name="players/teams" value={teamsAmt} min={minTeams} max={maxTeams} setValue={setTeamsAmt}/>
                    <SelectAmount name="rounds" value={roundsAmt} min={minRounds} max={maxRounds} setValue={setRoundsAmt}/>
                    <SelectAmount name="guesses (per round, per team)" value={guessAmt} min={minGuess} max={maxGuess} setValue={setGuessAmt}/>
                    <ButtonWrapper>
                        <button className="start-game-button"
                        onClick={() => startGame()}>START GAME</button>     
                    </ButtonWrapper>
                             
                </div>
                <Hints/> 
                </div>:"" }

            { isPlaying && randomCategories[currentCategory] ? 
                <div className="guesses-container">
                    <div className="full-header">
                        <div className="game-header">
                            <div className="rounds">Round {currentRound}/{roundsAmt}</div>
                            <div className="category">
                                <div className="title">{randomCategories[currentCategory].name}</div>
                                <div className="source">Source: {randomCategories[currentCategory].source}</div>
                                <div className="updated">Updated: {formatDateAdded(randomCategories[currentCategory].dateAdded)}</div>
                            </div>
                            <div className="guess-remaining">
                                <div className={"num" + theme}> {Math.ceil(guessAmt/teamsAmt)}</div> guess(es) left</div>
                        </div>
                        <div className="top-answers-container">
                            { (isRoundOver || isGameOver) && !showTopAnswers ? 
                            
                            <ButtonWrapper>
                                <button id="show-top-answers-button"
                                onClick={() => toggleTopAnswers()}>Show Top Answers</button>
                            </ButtonWrapper>:""}
                            
                            { showTopAnswers ? 
                                <TopAnswers category={randomCategories[currentCategory]}/>:""}
                        </div>
                    </div>
                    { !isGameOver ? !isRoundOver ?
                       <>
                       <GuessInput errorMsg={errorMsg} guess={guess} enterGuess={enterGuess} setGuess={setGuess}/>
                       </>:"":""}
                    <div className="game-buttons">
                        { isRoundOver && !isGameOver ? 
                            <ButtonWrapper>
                            <button className="next-round-button"
                            onClick={() => nextRound()}>Next Round</button>
                            </ButtonWrapper>:""}

                        { isGameOver ? 
                            <ButtonWrapper>
                                <button className="reset-game-button"
                                onClick={() => resetGame()}>Reset</button>   
                            </ButtonWrapper>:""}                        
                    </div>
                    <div className="teams-container">
                        {teams?.map(t => 
                            <TeamCard key={t.name} team={t} n={teamsAmt} theme={theme}/>
                        )}
                    </div>
                </div>:""}
        </div>
        </div>
    )
}

interface GuessInputProps {
    errorMsg:ReactElement|null
    guess:string
    enterGuess:(e:React.FormEvent) => void
    setGuess:(s:string) => void
}
export function GuessInput({errorMsg, guess, enterGuess, setGuess}:GuessInputProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <form id="submit-guess" onSubmit={(e) => enterGuess(e)}>
            <label>Enter a guess</label>
            {errorMsg}
            <div id={errorMsg ? "input-error":""}>
                <input type="text" placeholder="enter a guess" required id={ errorMsg ? "input-error":""}
                    className={"guess-input" + theme}
                    value={guess} onChange={e => setGuess(e.target.value)}>
                </input>
            </div>
            <ButtonWrapper>
                <button type="submit" id="enter-guess-button">GUESS</button>   
            </ButtonWrapper>
            
        </form>
    )
}

interface ErrorMsgProps {
    guess:string
}
export function ErrorMsg({guess}:ErrorMsgProps) {
    return(
        <div key={"key"} className="error-msg">
            <p>Already guessed "{guess}"
            <br/>You may need to try again with more precision</p>
        </div>
    )
}

export function Hints() {
    const {theme} = useContext(ThemeContext)
    return(
        <div className="hints">
            <p id="section-title">Some notes and hints</p>
            <div>
                <p>Be as precise as possible. Guesses are case insensitive.</p> 
                <p className="subtitle">Some small typos/imprecisions are acceptable, for example:</p>
                    <GuessExample guess="spderman" match="Spider-Man" isMatch={true}/>
                    <GuessExample guess="atnt" match="AT&T" isMatch={true}/>

                <p className="subtitle">Subtitles may be recognized but it is better to guess the full name, for example:</p>
                    <GuessExample guess="endgame" match="Avengers: Endgame" isMatch={true}/>
                    <GuessExample guess="the way of water" match="Avatar: The Way of Water" isMatch={true}/>
                
                <p className="subtitle">You must be specific with numbered items, for example:</p>
                    <GuessExample guess="spiderman" match="Spider-Man" isMatch={true}/>
                    <GuessExample guess="spiderman" match="Spider-Man 2" isMatch={false}/>

                <p className="subtitle">For some categories, if your guess is <span className={"example" + theme}>wrong but within the top 110,</span> the rank will be given as a hint</p>
            </div>
        </div>
    )
}

interface GuessExampleProps {
    guess:string
    match:string
    isMatch:boolean
}
function GuessExample({guess,match,isMatch}:GuessExampleProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <p><span className={"example" + theme}>"{guess}"</span> {isMatch ? "will":"will NOT"} match <span className={"example" + theme}>"{match}"</span></p>
    )

}