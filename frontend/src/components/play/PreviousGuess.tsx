
import { useContext, useEffect, useState } from "react";
import type { GuessResult } from "../interfaces";
import "./previous-guess.css"
import { ThemeContext } from "../../App";

interface Guesses {
    guesses: GuessResult[]
}
export default function PreviousGuesses({guesses}:Guesses) {
    if (guesses && guesses.length > 1) {
        const temp = [...guesses]
        temp.splice(0,1)
    
        return(    
            <>
            <LastGuess guess={guesses[0].guess} points={guesses[0].points} isValid={guesses[0].isValid} attempt={guesses[0].guess}/>
            <div className="previous-guesses-container">
                {temp.map(g => <PreviousGuess key={g.guess} guess={g.guess} points={g.points} isValid={g.isValid} attempt={g.guess}/>)}
            </div>
            </>
        )
    }
    
    else if (guesses[0]) return(
        <LastGuess guess={guesses[0].guess} points={guesses[0].points} isValid={guesses[0].isValid} attempt={guesses[0].guess}/>
    )
}

function LastGuess({guess, points, isValid}:GuessResult) {
    const {theme} = useContext(ThemeContext)
    const [show, setShow] = useState(true)

    function animateGuess() {
        setShow(false)
        setTimeout(() => setShow(true), 3)
    }

    useEffect(() => {
        animateGuess()
    }, [guess])

    return(
        <div className={`${'last-guess'+theme} ${isValid && points <= 100 ? 'valid-guess':'invalid-guess'} ${show ? 'show-guess':'hide-guess'}`} 
            id={isValid && points >= 90 && points <= 100 ? 'golden-guess':''}>
                <div className="guess">  
                    {`${guess} ${points > 100 ? `(Hint: ${points})`:""}`}
                </div>
                <div className="points">{points > 100 ? 0:points}</div>
        </div>
    )
}

function PreviousGuess({guess, points, isValid}:GuessResult) {
    const {theme} = useContext(ThemeContext)
    return(
        <div className={`${'previous-guess'+theme} ${isValid && points <= 100 ? 'valid-guess':'invalid-guess'}`}
            id={isValid && points >= 90 && points <= 100 ? 'golden-guess':''}>
            <div className="guess">  
                {`${guess} ${points > 100 ? `(Hint: ${points})`:""}`}
            </div>
            <div className="points">{points > 100 ? 0:points}</div>
        </div>
    )
}