function matchPercentage(guessStr:string, matchStr:string) {

    let hasSpecifier = false
    let didSpecifierMatch = false
    let hasSpecifierDigits = false
    let specifierMatchPercentage = 0

    let hasDigits = false
    let didDigitsMatch = false
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

function digitsMatch(guess:string, real:string) {
    /*  Expected behaviour
        ABC vs ABC 1 = 0%  -> NOT PASS (else ABC would match with ABC 1, ABC 2, etc and this is not the intended behaviour)
        ABC 1 vs ABC 2 = 0% -> NOT PASS
        ABC 11 vs ABC 12 = 50% -> NOT PASS (not considred typo)

        ABC 451 vs ABC 452 = 66% -> PASS (considered as typo if same length (3+) and 60+% match)
        ABC 1 vs ABC 21 = 50% -> PASS (considered as typo)
        ABC 12 vs ABC 21 = 100% -> PASS (considered as typo)
        ABC 12 vs ABC 12 = 100% -> PASS
        12 ABC vs ABC 12 = 100% -> PASS (considered as typo) 
        1 ABC vs ABC 12 = 50% -> PASS (considered as typo) 
    */
    const digits = getNumbers(real)
    const guessDigits = getNumbers(guess)
    let finalMatchPercentage = 0
    if (digits && guessDigits) {
        const minDigitsMatchPercentage = 50
        let digitsMatch = 0
        let tempGuessDigits = [...guessDigits]
        digits.map(d => {
            let match = tempGuessDigits.find(gd => gd === d)
            if (match) {
                digitsMatch++
                let index = tempGuessDigits.indexOf(d)
                if (index >= 0)
                    tempGuessDigits.splice(index,1)   
            }
        })
        const digitsMatchPercentage = (digitsMatch/digits.length) * 100
        if (digitsMatchPercentage < minDigitsMatchPercentage) finalMatchPercentage = 0
        else if (guessDigits.length == digits.length && digitsMatchPercentage < 60)
            finalMatchPercentage = 0
        else finalMatchPercentage = digitsMatchPercentage
    } 
    else if (!(!digits && !guessDigits)) finalMatchPercentage = 0

    return finalMatchPercentage
}


function textMatch(guess:string, match:string, isSpecifier?:boolean) {
    let textMatchPercentage = 0
    let attempt2 = 0
    let guessText = guess.match(/[a-zA-Z]+((\&|-)[a-zA-Z]+)?|('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    let matchText = match.match(/[a-zA-Z]+((\&|-)[a-zA-Z]+)?|('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    let prepositions = match.match(/[&]/g)?.map(s => s.trim()).filter(s => s.length > 0)

    if (guessText && matchText)
        if (isSpecifier == true) textMatchPercentage = textMatchHelper(guessText, matchText, isSpecifier, prepositions)
        else textMatchPercentage = textMatchHelper(guessText, matchText, undefined, prepositions)
    
    guessText = guess.match(/[a-zA-Z\dÀ-ú]+('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    matchText = match.match(/[a-zA-Z\dÀ-ú]+('[a-zA-Z])?|([a-zA-Z]+)?(\.)?(\s)?(\d+)/g)?.map(s => s.trim()).filter(s => s.length > 0)
    
    if (guessText && matchText)
        if (isSpecifier == true) attempt2 = textMatchHelper(guessText, matchText, isSpecifier, prepositions)
        else attempt2 = textMatchHelper(guessText, matchText, undefined, prepositions)

    console.log("atp1", "atp2", textMatchPercentage, attempt2)
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

    console.log("parsed2", guessText, matchText)

    let guessesMatched = 0
    let specifiersMatched = 0
    let matchRatio = 0

    if (matchText && guessText) {
        let totalChars = 0
        for (let i=0; i<matchText.length; i++) totalChars += matchText[i].length
        let longuestWord = matchText.reduce((a,b) => a.length > b.length ? a:b)
        console.log("total", totalChars, "longest", longuestWord)
        
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
                    concatMatchPct = wordMatch(guessText[i], matchText[j].concat(matchText[j+1]))
                    if (concatMatchPct >= wordMatchPct) {
                        wordMatchPct = concatMatchPct
                        isConcatMatch = true
                    }
                } else if (j > 0 && guessText.includes(matchText[j-1].concat(matchText[j]))) {
                    concatMatchPct = wordMatch(guessText[i], matchText[j-1].concat(matchText[j]))
                    if (concatMatchPct >= wordMatchPct) {
                        wordMatchPct = concatMatchPct
                        isConcatMatch = true
                    }
                }
                
                console.log("wc%",wordMatchPct)
                
                if (wordMatchPct > 0.65 
                    || (guessText[i].includes(matchText[j]) && matchText[j].length/guessText[i].length > 0.5) 
                    || (matchText[j].includes(guessText[i]) && guessText[i].length/matchText[j].length > 0.5)
                    || (matchText.length - j > 1 && guessText.includes(matchText[j].concat(matchText[j+1])))
                    || (guessText.length - i > 1 && matchText.includes(guessText[i].concat(guessText[i+1])))){
                    
                    isMatch = true 
                    guessesMatched++       
                    if (isSpecifier && wordMatchPct > 0.90) specifiersMatched++                  
                }
                //console.log("m,gl",guessText[i], matchText[j], longuestWord)
                //console.log("long?", (matchText[j]==longuestWord))
                let matchFactor = (isMatch && matchText[j]==longuestWord && wordMatchPct > 0.94) ? 1.2:1 
                let weight = matchText[j].length/totalChars
                let weightedPct = (wordMatchPct*matchFactor)*(weight)
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
            console.log("all %", wordMatches)
            finalWordMatches.push(Math.max(...wordMatches))
            console.log("max %", finalWordMatches)
        }
            if (!finalWordMatches[0]) finalWordMatches.push(0)
            console.log("wrdmtchs", finalWordMatches)
            textMatchPercentage = finalWordMatches.reduce((a,b) => a+b)
            console.log("ptxt%", textMatchPercentage)

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
    console.log("txt dist", txtDist)
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
    console.log("ratio", matchRatio)
    let final = 0

        if (matchRatio >= 0.8) final = matchRatio*0.15 + textMatchPercentage*0.85
        else if (matchRatio >= 0.6 &&  matchRatio < 0.8) final = matchRatio*0.25 + textMatchPercentage*0.75
        else if (matchRatio >= 0.5 &&  matchRatio < 0.6) final = matchRatio*0.50 + textMatchPercentage*0.50
        else final = matchRatio*0.85 + textMatchPercentage*0.15

    console.log("txt%", final)
    return final*100
}

function wordMatch(word1:string, word2:string) {
    let finalMatchPercentage = 0
    let match = 0
    let max = word1.length > word2.length ? word1.length:word2.length
    //let min = guess.length < real.length ? guess.length:real.length
    let streak = false
    let prevDist = 0
    console.log("wordmatch", word1, word2)

    let tempReal = word2.match(/[a-zA-Z\d\&]/g)
    if (tempReal)
    for (let i=0; i<word1.length; i++) {
        let distances = []
        let dist = -1
       
        for(let j=0; j<tempReal.length; j++) {
            //console.log("compare", word1[i], tempReal[j])
            let acceptedMatch = (((word1[i]=="n" && tempReal[j]=="&")||(word1[i]=="&" && tempReal[j]=="n")) && Math.abs(j-i) == 0)
            
            if ((word1[i] === tempReal[j]) || acceptedMatch) {
                let matchDist = Math.abs(j-i)       
                distances.push(matchDist)
            }
        }

        if (distances.length > 0) dist = Math.min(...distances)
        //console.log("m,p", dist, prevDist)
        
        if (dist > 0 && dist == prevDist) {
            prevDist = dist
            dist = 0
        } else prevDist = dist

        console.log("l dist", dist)
        switch(dist) {
            case 0: match += 1
                break
            case 1: match += 0.5
                break
            case 2: match -= 0.1
                break
            case 3: match -= 0.5
                break
            default: match -= 0.8
                break
        }
    }
        finalMatchPercentage = match/max
    if (finalMatchPercentage <= 0.30)
        if (word1.includes(word2) && (word2.length/word1.length >= 0.70)) {
            finalMatchPercentage *= 1+(word2.length/word1.length)+0.1
        }
        else if (word2.includes(word1) && (word1.length/word2.length >=0.70)) {
            finalMatchPercentage *= 1+(word1.length/word2.length)+0.1
        }
    console.log("len, %", word2.length, finalMatchPercentage)
    let wordDist = Math.round((word2.length - (finalMatchPercentage*word2.length))*Math.pow(1.05, word2.length/2) - Math.abs(word2.length - word1.length))
    console.log("word dist", wordDist)
    wordDist = wordDist < -1 ? -10:wordDist
        switch(wordDist) { 
            case -1:  
            case 0:
            case 1: finalMatchPercentage *= 1.15
                break
            case 2: finalMatchPercentage *= 0.98
                break  
            case -10: finalMatchPercentage *= 1.5
                break 
            default: finalMatchPercentage *= 0.90
        }
    if (finalMatchPercentage > 1) finalMatchPercentage = Math.floor(finalMatchPercentage)
    console.log("final adj", finalMatchPercentage)
    return finalMatchPercentage
}

interface MatchPct {
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
    if (avg < 50) pass = false
    if (hasSpecifierDigits && digitsMatchPercentage == 100 && avg > 55) pass = true
    return {score:Number(avg.toFixed(2)), pass}
}

export function isMatch(guess:string, match:string) {
    let matchPct = matchPercentage(guess, match)
    console.log(matchPct)
    let matchAvg = matchAverage(matchPct)
    return matchAvg
}

function getNumbers(str:string) {
    let numbers = str.match(/\d/g)
    let strParse = str.split(/:|,|\s/).map(e => " "+e+" ")
    let romanNums:string[] = []
    for (let i=0; i<strParse.length; i++) {
        let romanNum = strParse[i].match(/(\s)?[^a-z]m{0,3}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})[^a-z](\s)?/g)
        if (romanNum && romanNum[0].length > 0) romanNums = [...romanNums, romanNum[0]]
    }
    let ints = romanNums.map(r => String(romanToInt(r)))
    let intStr = ""
    for (let i=0; i<ints.length; i++) {
        if (ints[i] !== "0")
        intStr += ints[i]+" "
    }
    let intRomanNumbers = intStr.match(/\d/g)
    let finalResult:string[]|null = []
    if (numbers) finalResult = [...numbers]
    if(intRomanNumbers) finalResult = [...finalResult, ...intRomanNumbers]
        return finalResult.length > 0 ? finalResult:null
}

function romanToInt(r:string) {
    function romanValue(c:string) {
        switch(c.toLowerCase()) {
            case "i": return 1
            case "v": return 5
            case "x": return 10
            case "l": return 50
            case "c": return 100
            case "d": return 500
            case "m": return 1000
            default: return 0
        }
    }

    let value = 0
    for (let i=0; i<r.length; i++) {
        let v1 = romanValue(r[i])
        let v2 = r.length - i > 1 ? romanValue(r[i+1]):0
        value += v1 >= v2 ? v1:-v1
    }
    return value
}
let str = "mirosft"; let str2 = "Microsoft"
console.log(isMatch(str,str2))
// str = "far frm home"; str2 = "Spider-Man: Far From Home"
//console.log(isMatch(str,str2))

// 15,mirosft,Microsoft,TRUE,[58.8,false]
// 35,secrt lif of pts,The Secret Life of Pets,FALSE,[84.38,true]
// 96,ant mn,Ant-Man,TRUE,[78.75,false]
// 106,captainamerica,Captain America,TRUE,[19.71,false]
// 107,ironman,Iron Man,TRUE,[0,false]
// 108,blackpanther,Black Panther,TRUE,[20.42,false]
// 109,doctorstrange,Doctor Strange,TRUE,[12.38,false]
// 123,newzealand,New Zealand,TRUE,[60.03,false]
// 164,lisboan,Lisbon,TRUE,[77.21,false]
// 185,capetown,Cape Town,TRUE,[0,false]
// 238,force awakens,Star Wars: Episode VII - The Force Awakens,TRUE,[40.22,false]
// 239,last jedi,Star Wars: Episode VIII - The Last Jedi,TRUE,[29.81,false]
// 260,eldenring,Elden Ring,TRUE,[0,false]
// 263,super mario,Super Mario Bros.,TRUE,[78.57,false]