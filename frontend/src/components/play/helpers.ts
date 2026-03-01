import { isMatch } from "../../guess_match/guessMatch"
import type { Category, CategoryElement, GuessResult, Team } from "../interfaces"

export function checkGuess(guess:string, category:Category) {
    if (!category) return
    const data = category?.data as CategoryElement[]
    const guessResult:GuessResult = {
        guess,
        attempt: guess,
        isValid: false,
        points:0
    }

    //try "name"
    let findGuess = data.find(e => isMatch(guess, e.name).pass)
    
    //if still no match try with "other" - e.g. company stock symbol instead of name
    if (!findGuess) findGuess = data.find(e => e.other && e.other.length > 1 ? isMatch(guess,e.other).pass:false)
        
    if (findGuess) {
        guessResult.isValid = true
        guessResult.points = Number(findGuess.rank)
        guessResult.guess = findGuess.name
        guessResult.attempt = guess
    }
    return guessResult
}

export function calculateScore(guesses:GuessResult[]) {
    let score = 0;
    if (guesses) {
        guesses.map(g => {
            if (g.points < 100)
            score += g.points
        })
    }
    return score
}

export function getRandomInt(min:number, max:number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min)+min)  
}

export function shuffleArray(array:Object[]) {
    for (let i=array.length-1; i>0; i--) {
        let j = getRandomInt(0, array.length-1);
        [array[i], array[j]] = [array[j], array[i]]
    }
}

export function createTeams(amt:number, teamNames:string[]) {
    let teams:Team[] = []
    for (let i=0; i<amt; i++) {
        let name = teamNames[i] ? teamNames[i]:`Team ${i+1}`
        teams.push({name, guesses:[], score:0, isCurrentTeam:false, isWinner:false})
    }
    return teams
}

export function findWinnerIndex(teams:Team[]) {
    let winnerIndex = 0
    for(let i=1; i<teams.length; i++) {
       winnerIndex = teams[i].score >= teams[winnerIndex].score ? i:winnerIndex  
    }
    return winnerIndex
}