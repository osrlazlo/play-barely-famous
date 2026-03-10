import { getNumbers, romanToInt } from "./digitsMatch.ts"
import { PASS_THRESHOLD, wordMatch } from "./wordMatch.ts"

export function textMatch(guess:string, match:string, isSpecifier?:boolean) {
    let t1 = textMatchHandler(guess, match, isSpecifier)
    let t2 = textMatchHandler(match, guess, isSpecifier)
    let avg = (t1+t2)/2
    return avg
}

export function textMatchHandler(guess:string, match:string, isSpecifier?:boolean) {
    let textMatchPercentage = 0
    let attempt2 = 0
    guess = guess.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    match = match.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    let guessText = guess.match(/[a-zA-Z']+((\&|-)[a-zA-Z]+)?|('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    let matchText = match.match(/[a-zA-Z']+((\&|-)[a-zA-Z]+)?|('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    let prepositions = match.match(/[&]/g)?.map(s => s.trim()).filter(s => s.length > 0)
    //console.log("atp1", guessText, matchText)

    if (guessText && matchText)
        if (isSpecifier == true) textMatchPercentage = textMatchHelper(guessText, matchText, isSpecifier, prepositions)
        else textMatchPercentage = textMatchHelper(guessText, matchText, undefined, prepositions)
    
    guessText = guess.match(/[a-zA-Z\dÀ-ú]+('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    matchText = match.match(/[a-zA-Z\dÀ-ú]+('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    //console.log("atp2", guessText, matchText)

    if (guessText && matchText)
        if (isSpecifier == true) attempt2 = textMatchHelper(guessText, matchText, isSpecifier, prepositions)
        else attempt2 = textMatchHelper(guessText, matchText, undefined, prepositions)

    //console.log("atp1", "atp2", textMatchPercentage, attempt2)
    textMatchPercentage = textMatchPercentage > attempt2 ? textMatchPercentage:attempt2
    return textMatchPercentage
}

function textMatchHelper(guessText:string[], matchText:string[], isSpecifier?:boolean, prepositions?:string[]) {
    let textMatchPercentage = 0
    //console.log("parsed", guessText, matchText)
        
    if (guessText.length < matchText.length) {
        let det = matchText.find(e => e=="the"||e=="or"||e=="and"||e=="of"||e=="episode"||e=="part"||e=="vol")
        if (!guessText.find(e => e == det)) {
            let index = det ? matchText.indexOf(det):-1
            if (index != -1) matchText.splice(index,1)
        }     
    }

    //console.log("parsed2", guessText, matchText)

    let guessesMatched = 0
    let specifiersMatched = 0
    let matchRatio = 0

    if (matchText[0] && guessText[0]) {
        let totalChars = 0
        for (let i=0; i<matchText.length; i++) totalChars += matchText[i].length
        let longuestWord = matchText.reduce((a,b) => a.length > b.length ? a:b)
        //console.log("total", totalChars, "longest", longuestWord)
        
        let finalWordMatches = []

        for (let i=0; i<guessText.length; i++) {
            let isMatch = false
            let j=0
            let wordMatches = []
            let isConcatMatch = false
            for (; j<matchText.length; j++) { 
                isMatch = false
                
                if (getNumbers(matchText[j])) {
                    matchText[j] = romanToInt(matchText[j]) !== 0 ? String(romanToInt(matchText[j])):matchText[j]
                    //console.log("num", matchText[j])
                }

                if (getNumbers(guessText[i])) {
                    guessText[i] = romanToInt(guessText[i]) !== 0 ? String(romanToInt(guessText[i])):guessText[i]
                    //console.log("num", guessText[i])
                }

                let wordMatchPct = wordMatch(guessText[i], matchText[j])
                //console.log("w%",wordMatchPct)
                let concatMatchPct = 0
                if (matchText.length - j > 1 && guessText.includes(matchText[j].concat(matchText[j+1]))) {
                    concatMatchPct = wordMatch(guessText[i], matchText[j].concat(matchText[j+1])).score
                    if (concatMatchPct <= wordMatchPct.score) {
                        wordMatchPct.score = concatMatchPct
                        isConcatMatch = true
                    }
                } else if (j > 0 && guessText.includes(matchText[j-1].concat(matchText[j]))) {
                    concatMatchPct = wordMatch(guessText[i], matchText[j-1].concat(matchText[j])).score
                    if (concatMatchPct <= wordMatchPct.score) {
                        wordMatchPct.score = concatMatchPct
                        isConcatMatch = true
                    }
                }
                
                //console.log("wc%",wordMatchPct)
                
                if (wordMatchPct.score <= PASS_THRESHOLD
                    || (guessText[i].includes(matchText[j]) && matchText[j].length/guessText[i].length > 0.5) 
                    || (matchText[j].includes(guessText[i]) && guessText[i].length/matchText[j].length > 0.5)
                    || (matchText.length - j > 1 && guessText.includes(matchText[j].concat(matchText[j+1])))
                    || (guessText.length - i > 1 && matchText.includes(guessText[i].concat(guessText[i+1])))){
                    
                    isMatch = true 
                    guessesMatched++       
                    if (isSpecifier && wordMatchPct.score < PASS_THRESHOLD) specifiersMatched++                  
                }
                //console.log("m,gl",guessText[i], matchText[j], longuestWord)
                //console.log("long?", (matchText[j]==longuestWord))
                let matchFactor = (isMatch && matchText[j]==longuestWord && wordMatchPct.score <= PASS_THRESHOLD) ? 1.2:1 
                let weight = matchText[j].length/totalChars
                let weightedPct = ((100-wordMatchPct.score)/100)*matchFactor*weight
                if (isConcatMatch) weightedPct *= 2
                if (weightedPct > 1) weightedPct = Math.floor(weightedPct)
                
                wordMatches.push(weightedPct)
                
                //console.log("wrd%", wordMatchPct, matchFactor, weight, weightedPct)

                if (isMatch == true && Math.abs(guessText.length-matchText.length) > 1) {
                    matchText[j] = "$"
                    break
                }
            }
            if (!wordMatches[0]) wordMatches.push(0)
            //console.log("all %", wordMatches)
            finalWordMatches.push(Math.max(...wordMatches))
            //console.log("max %", finalWordMatches)
        }
            if (!finalWordMatches[0]) finalWordMatches.push(0)
            //console.log("wrdmtchs", finalWordMatches)
            textMatchPercentage = finalWordMatches.reduce((a,b) => a+b)
            //console.log("ptxt%", textMatchPercentage)

        if ((guessText.length < matchText.length 
            && matchText.find(e => e.match(/the|or|and|of|episode|part|vol/))
            && !guessText.find(e => e.match(/the|or|and|of|episode|part|vol/)))) {
                specifiersMatched++
                guessesMatched++
            }
        
        ////console.log("prep", prepositions)
        if (prepositions && prepositions.find(s => s=="&") && guessText.find(s => s=="and")) {
            specifiersMatched++
            guessesMatched++
        }

        //console.log("r", guessesMatched,guessText.length, specifiersMatched, matchText.length, textMatchPercentage)
        
        if (isSpecifier) {  
            specifiersMatched = specifiersMatched > matchText.length ? matchText.length:specifiersMatched
            //console.log("spec matched", specifiersMatched, matchText.length)
            matchRatio = specifiersMatched/matchText.length
        } else {
            guessesMatched = guessesMatched > guessText.length ? guessText.length:guessesMatched
            matchRatio = guessesMatched/guessText.length 
        }
            
        if (textMatchPercentage > 1) textMatchPercentage = Math.floor(textMatchPercentage)
        else if (textMatchPercentage < -1) textMatchPercentage = Math.ceil(textMatchPercentage)
    }

    let txtDist = Math.round((matchText.length - (textMatchPercentage*matchText.length))*Math.pow(1.05, matchText.length/2) - Math.abs(matchText.length - guessText.length))
    //console.log("txt dist", txtDist)
    txtDist = txtDist < 0 ? 0:txtDist
        switch(txtDist) {   
            case 0: textMatchPercentage *= 1.10
                break
            case 1: textMatchPercentage *= 1.05
                break
            case 2: textMatchPercentage *= 0.95
                break   
            default: textMatchPercentage *= 0.90
        }
    if (textMatchPercentage > 1) textMatchPercentage = Math.floor(textMatchPercentage)
    //console.log("txt ratio", matchRatio)
        
    let final = 0
        
        if (matchRatio >= 0.8) final = matchRatio*0.15 + textMatchPercentage*0.85
        else if (matchRatio >= 0.6 &&  matchRatio < 0.8) final = matchRatio*0.25 + textMatchPercentage*0.75
        else if (matchRatio >= 0.5 &&  matchRatio < 0.6) final = matchRatio*0.50 + textMatchPercentage*0.50
        else final = matchRatio*0.85 + textMatchPercentage*0.15
        
    //console.log("txt%", final)
    return final*100
}