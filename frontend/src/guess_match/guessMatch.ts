import { digitsMatch, getNumbers } from "./digitsMatch.ts"
import { textMatch } from "./textMatch.ts"

export function isMatch(guess:string, match:string) {
    let matchPct = matchPercentage(guess, match)
    //console.log(matchPct)
    let matchAvg = matchAverage(matchPct)
    return {...matchAvg, str1:guess, str2:match, matchResult:matchPct}
}

function matchPercentage(guessStr:string, matchStr:string) {
    let hasSpecifier = false
    let didSpecifierMatch = false
    let hasSpecifierDigits = false
    let specifierMatchPercentage = 0

    let hasDigits = false
    //let didDigitsMatch = false
    let digitsMatchPercentage = 0

    let textMatchPercentage = 0

    if (!guessStr|| !matchStr) return {digitsMatchPercentage, textMatchPercentage, specifierMatchPercentage, hasSpecifier, hasDigits, hasSpecifierDigits}
    
    const guess = guessStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const match = matchStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    if (match.includes(":")||match.includes("(")) {
        hasSpecifier = true
        let specifier = match.match(/(:|\()[(\s)?a-zA-Z\d\.\,\'-]+/g)
        //console.log(specifier)
        if (specifier) {
            if (specifier.find(s => getNumbers(s) != null)) hasSpecifierDigits = true
            specifierMatchPercentage = textMatch(guess, specifier[0].substring(1,), true)
            if (specifierMatchPercentage >= 60) didSpecifierMatch = true
           //console.log("specifier", specifierMatchPercentage)
        }
    }

    if (getNumbers(guess)||getNumbers(match)) {
        hasDigits = true
        digitsMatchPercentage = digitsMatch(guess, match)
    }
    
    textMatchPercentage = textMatch(guess, match)

    let result = {digitsMatchPercentage, textMatchPercentage, specifierMatchPercentage, hasSpecifier, hasDigits, hasSpecifierDigits}
    return result
}

export interface MatchPct {
    digitsMatchPercentage:number
    textMatchPercentage:number 
    specifierMatchPercentage:number 
    hasSpecifier:boolean 
    hasDigits:boolean
    hasSpecifierDigits:boolean
}

function matchAverage(matchPct:MatchPct) {
    let {digitsMatchPercentage, textMatchPercentage, specifierMatchPercentage, hasSpecifier, hasDigits, hasSpecifierDigits} = matchPct
    let pass = false
    let avg = 0
    if (hasSpecifier) {
        if (hasDigits) {
            if (((specifierMatchPercentage >= 80 || digitsMatchPercentage > 85) && textMatchPercentage >= 60)) {
                pass = true
                specifierMatchPercentage *=1.3
            }
            avg = ((textMatchPercentage+specifierMatchPercentage+digitsMatchPercentage)/3)
            avg = avg > 100 ? 100:avg
        
        } else {
            if ((specifierMatchPercentage >= 75 && textMatchPercentage >= 60) || specifierMatchPercentage == 100 || specifierMatchPercentage > 94 && textMatchPercentage > 45) {
                pass = true
                specifierMatchPercentage *=1.3
            }
            avg = ((textMatchPercentage+specifierMatchPercentage)/2)
            avg = avg > 100 ? 100:avg
        }

    } else {
        if (hasDigits) {
            if ((digitsMatchPercentage >= 80 && textMatchPercentage >= 80) || (digitsMatchPercentage == 100 && textMatchPercentage >= 75) || (digitsMatchPercentage > 66 && textMatchPercentage == 100))
                pass = true
            
            avg = ((digitsMatchPercentage+textMatchPercentage)/2)
            avg = avg > 100 ? 100:avg
        } else {
            if (textMatchPercentage >= 80) pass = true
            avg = textMatchPercentage
        }
    }
    if (hasSpecifierDigits && digitsMatchPercentage == 100 && avg > 65 && textMatchPercentage > 60) pass = true
    if (avg < 50) pass = false
    
    return {score:Number(avg.toFixed(2)), pass}
}

// let str1 = "loreal"; let str2 = "L'Oréal"
// console.log(isMatch(str1,str2))
// str1 = "pokemon"; str2 = "Pokémon"
// console.log(isMatch(str1,str2))