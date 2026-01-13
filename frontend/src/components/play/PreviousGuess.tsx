
import type { GuessResult } from "./interfaces";
import "./previous-guess.css"

export default function PreviousGuess({guess, points, isValid}:GuessResult) {
    return(
        <div className={`previous-guess ${isValid && points <= 100 ? 'valid-guess':'invalid-guess'} ${isValid && points >= 90 && points <= 100 ? 'golden-guess':''}`}>
            <div className="guess">  
                {`${guess} ${points > 100 ? `(Hint: ${points})`:""}`}
            </div>
            <div className="points">{points > 100 ? 0:points}</div>
        </div>
    )
}