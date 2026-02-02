export interface GuessResult {
    guess:string
    isValid:boolean
    points:number
    attempt:string
}

export interface CategoryElement {
    rank:number
    name:string
    other?:string
}

export interface Category {
    name:string,
    id:number|string
    plays:number|string
    data:CategoryElement[]
    source:string
    dateUpdated:string|Date
    tags?:string[]
}

export interface Team {
    name:string
    guesses:GuessResult[]
    score:number
    isCurrentTeam:boolean
    isWinner:boolean
}