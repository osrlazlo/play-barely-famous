import { FaTrophy } from "react-icons/fa";
import type { Team } from "./interfaces";
import PreviousGuess from "./PreviousGuess";

interface TeamCardProps {
    team:Team
}
export default function TeamCard({team}:TeamCardProps) {

    return(
        <div className={`
                team-card 
                ${team.isCurrentTeam ? "current-team":""}
                ${team.isWinner ? "winning-team":""}
                `}>
            <h3>{team.name}</h3>
            <div className="score">{team.isWinner ? <FaTrophy className="guess-trophy-icon"/>:""}{team.score}</div>
            <div className="team-guesses">
                {team.guesses ? 
                    <>
                    {team.guesses.map(g => 
                        <PreviousGuess key={g.guess} guess={g.guess} points={g.points} isValid={g.isValid} attempt=""/>)}
                    </>:""}
            </div>
        </div>
    )
}