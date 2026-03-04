import { FaTrophy } from "react-icons/fa";
import type { Team } from "../interfaces";
import PreviousGuesses from "./PreviousGuess";
import { useContext, useState } from "react";
import './teams.css'
import { ThemeContext } from "../../App";

interface TeamCardProps {
    team:Team
    n:number
}

export default function TeamCard({team, n}:TeamCardProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <div className={`
                ${"team-card" + theme} 
                ${team.isCurrentTeam ? "current-team":""}
                ${team.isWinner ? "winning-team" + theme:""}
                teams-${n}`}>
            <h3>{team.name}</h3>
            <div className="score">{team.isWinner ? <FaTrophy className="guess-trophy-icon"/>:""}{team.score}</div>
            <div className="team-guesses">
                {team.guesses ? <PreviousGuesses guesses={team.guesses} />:""}
            </div>
        </div>
    )
}