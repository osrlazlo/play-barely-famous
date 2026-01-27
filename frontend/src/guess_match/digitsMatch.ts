export function digitsMatch(guess:string, real:string) {
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

export function getNumbers(str:string) {
    let numbers = str.match(/\d/g)
    let strParse = str.split(/:|,|\s/).map(e => " "+e+" ")
    let romanNums:string[] = []
    for (let i=0; i<strParse.length; i++) {
        let romanNum = strParse[i].match(/(\s)?[^a-z']m{0,3}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})[^a-z'](\s)?/g)
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

export function romanToInt(r:string) {
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