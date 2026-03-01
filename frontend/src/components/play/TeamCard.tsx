import { FaTrophy } from "react-icons/fa";
import type { Team } from "../interfaces";
import PreviousGuesses from "./PreviousGuess";
import { useState } from "react";
import './teams.css'

interface TeamCardProps {
    team:Team
    n:number
    theme:string
}

export default function TeamCard({team, n, theme}:TeamCardProps) {
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

export function TeamName({teams, index, setTeamNames}:{teams:string[], index:number, setTeamNames: React.Dispatch<React.SetStateAction<string[]>>}) {

    const [teamName, setTeamName] = useState('')

    function setName(name:string) {
        setTeamName(name)
        const currentTeamNames = teams
        currentTeamNames[index] = name
        setTeamNames(currentTeamNames)
    }

    return(
        <div className="team-name-select">
            Team {index+1}: <input id='team-name-select' type="text" placeholder="Enter a team name" 
            value = {teamName} onChange={e => setName(e.target.value)}></input>
        </div>
    )
}