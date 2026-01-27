// dictionary for special cases
import fs from "fs"
import Papa from "papaparse"

// const dict_path = "C:/Users/AK/Desktop/CONCORDIA/Projects/barely-famous/frontend/src/guess_match/dictionary.csv"
// const file = fs.createReadStream(dict_path)
// const dictionary = await parseCSVtoJSON(file)
// //console.log(dictionary)

// function parseCSVtoJSON(file:File|string|fs.ReadStream, useHeader?:boolean): Promise<string[][]>|undefined{
//     useHeader = useHeader ? useHeader:false
//     if (!file) {
//         console.log("dictionnary file missing")
//         return
//     }
//     return new Promise((resolve, reject) => {
//         Papa.parse(file, {
//                 header: useHeader,
//                 skipEmptyLines: true,
//                 complete: function(results) {
//                     resolve([...results.data as string[][]])
//                 },
//                 error: (error) => {
//                     console.error(error)
//                     reject(error)
//                 }
//             })
//     })
// }

interface LetterMapValue {
    index:number
    dist:number
}
export const PASS_THRESHOLD = 1.2004 //currently: basicly = basically
export function wordMatch(word1:string, word2:string, noMathcDist?:number) {
    let nmd = noMathcDist ? noMathcDist:2
    let w1 = matchTester(word1,word2,nmd)
    let w2 = matchTester(word2,word1,nmd)

    let avg = {
                word1, 
                word2, 
                ratio:((w1.ratio+w2.ratio)/2).toFixed(4), 
                distance:((w1.distance+w2.distance)/2).toFixed(4),
                dist_ratio:((w1.dist_ratio+w2.dist_ratio)/2).toFixed(4),
                pass: false,
                score: 0
            }
    
            avg.score = (1-Number(avg.ratio))*Math.max(avg.word1.length, avg.word2.length) + Math.pow(Number(avg.dist_ratio),2)
            if (avg.score > 100) avg.score = 100

    if (avg.score <= PASS_THRESHOLD) avg.pass = true
    if (dictionary) 
        if (dictionary.find(e => e == avg.word1.toLowerCase()) && dictionary.find(e =>e == avg.word2.toLowerCase())) avg.pass = false
    return avg
}

function matchTester(word1:string, word2:string, noMathcDist?:number) {
    word1 = word1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    word2 = word2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    let matchRatio = 0
    let match = 0
    //let min = guess.length < real.length ? guess.length:real.length
    let prevDist = 0
    let wordDistances = [0]
    //console.log("wordmatch", word1, word2)
    let lettersMap = new Map<string, LetterMapValue>()

    let tempReal = word2.match(/[a-zA-Z'\d\&]/g)
    if (tempReal) 
    for (let i=0; i<word1.length; i++) {
        let distances = []
        let dist:number|null = null
        let hasMatch = false
        let j=0
        let matchIndex = word2.length
        let prevShortestDist:number|null = null
        
        for(; j<tempReal.length; j++) {
            //console.log("compare", word1[i], tempReal[j])
            let acceptedMatch = (((word1[i]=="n" && tempReal[j]=="&")||(word1[i]=="&" && tempReal[j]=="n")) && Math.abs(j-i) == 0)
            
            if ((word1[i] === tempReal[j]) || acceptedMatch) {
                let matchDist = i-j       
                distances.push(Math.abs(matchDist))
                hasMatch = true
                if (prevShortestDist == null) {
                    prevShortestDist = matchDist
                    matchIndex = j
                } 
                else if (Math.abs(matchDist) < Math.abs(prevShortestDist)) {
                    prevShortestDist = matchDist
                    matchIndex = j
                }
            }
        }

        if (hasMatch) {
            match++
            tempReal[matchIndex] = "$"
        }

        if (distances.length > 0) dist = distances.includes(0) ? 0:Math.min(...distances)
        if (dist != null) {
            //console.log("m,p", dist, prevDist)
            if (dist == prevDist) {
                prevDist = dist
                dist = 0
            } else prevDist = dist
            //console.log("nd", dist, prevDist)
        }

        noMathcDist = noMathcDist ? noMathcDist:2
        if (dist != null) {
            wordDistances.push(Math.abs(dist))
            lettersMap.set(word1[i], {index:i, dist:Math.abs(dist)})
        }
        else {
            let alreadyMatched = lettersMap.has(word1[i])
            if (alreadyMatched) {
                let prevMatch = lettersMap.get(word1[i])
                let matchIndex = prevMatch!.index + prevMatch!.dist
                //console.log(prevMatch, i)
                if (Math.abs(matchIndex-i) < prevMatch!.dist) {
                    wordDistances.push(-(prevMatch!.dist)+noMathcDist+Math.abs(matchIndex-i))
                } else wordDistances.push(noMathcDist)
            } else {
                wordDistances.push(noMathcDist)
            }            
        }
    }
        matchRatio = match/word2.length
    if (matchRatio <= 0.30)
        if (word1.includes(word2) && (word2.length/word1.length >= 0.70)) {
            matchRatio *= 1+(word2.length/word1.length)+0.1
        }
        else if (word2.includes(word1) && (word1.length/word2.length >=0.70)) {
            matchRatio *= 1+(word1.length/word2.length)+0.1
        }
    
    //let wordDist = Math.round((word2.length - (matchRatio*word2.length))*Math.pow(1.05, word2.length/2) - Math.abs(word2.length - word1.length))
    //console.log(word1, word2)
    //console.log("alldist", wordDistances)
    let wordDist = (wordDistances.reduce((a,b) => a+b)/word1.length*wordDistances.reduce((a,b) => a+b)/word2.length)*Math.pow(1.05, word2.length/2)
    //console.log(wordDist)
    //if (wordDist > 0.5 && wordDist < 1) wordDist = Math.abs(1-wordDist)
    //console.log("len", word2.length, "m", match,"ratio", matchRatio.toFixed(2), "word dist", wordDist.toFixed(2))
    //console.log(`distance between ${word1} = ${word2}:`, (wordDist*(1+1-matchRatio)).toFixed(2))
    
    let dist_ratio = wordDist*(1+1-matchRatio)
    return {word1,word2,ratio:matchRatio,distance:wordDist,dist_ratio}
}

const dictionary = [
'creations','reactions',
'bread','beard',
'seal','sale',
'cinema','iceman',
'acres','cares',
'evil','veil',
'notes','tones',
'horse','shore',
'mated','tamed',
'spare','parse',
'lemon','melon',
'save','vase',
'lump','plum',
'last','salt',
'late','tale',
'sore','rose',
'rome','more',
'spot','pots',
'slip','lips',
'grin','ring',
'heart','earth',
'listen','enlist',
'silent',
'painters','pertains',
'loop','pool',
'opts','stop',
'pear','reap',
'mate','team',
'meat',
'post','tops',
'owns','snow',
'dear','read',
'rate','tear',
'pest','step',
'pale','leap',
'leap','peal',
'loop','polo',
'stew','west',
'least','steal',
'peach','cheap',
'streaming','mastering',
'drawer','reward',
'stone','notes',
'evil','live',
'stop','pots',
'flow','wolf',
'star','rats',
'liar','rail',
'emit','time',
'paws','swap',
'bats','stab',
'snap','pans',
'trap','part',
'angel','glean',
'organise','ignoreas',
'claimer','miracle',
'triangle','integral',
'master','stream',
'parts','strap',
'smart','trams',
'diaper','repaid',
'desserts','stressed',
]


