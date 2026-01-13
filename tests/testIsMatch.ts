import Papa from "papaparse"
import fs from "fs"
import { isMatch } from "../frontend/src/components/play/matchPercentage.ts"
interface TestData {
    testNum:string
    str1:string
    str2:string
    expectedResult:string
}
async function testIsMatch(filePath:string) {
    const file = fs.createReadStream(filePath)
    let correctResults = 0
    let incorrectResults = []
    try {
        const data = await parseCSVtoJSON(file) as TestData[]
        //console.log(data)
        for(let i=0; i<data.length; i++) {
            const testMatch = isMatch(data[i].str1,data[i].str2)
            if (testMatch.pass == (data[i].expectedResult.toLowerCase() == "true")) {
                correctResults++
            } else incorrectResults.push({...data[i], testMatch})
        }       
        
    console.log(
    `
    Accuracy: ${(correctResults/data.length *100).toFixed(2)}
    Correct results: ${correctResults}/${data.length}
    Incorrect results: ${incorrectResults.length}
    ${printResults(incorrectResults)}
    `)
    } catch (error) {
        console.error(error)
    }
}

function parseCSVtoJSON(file:File|string|fs.ReadStream) {
    if (!file) throw new Error("file missing")
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    resolve([...results.data])
                },
                error: (error) => {
                    console.error(error)
                    reject(error)
                }
            })
    })
}
interface Result {
    testNum:string
    str1:string
    str2:string
    expectedResult:string
    testMatch: {score:number, pass:boolean}
}

function printResults(r:Result[]) {
    let str = ""
    if (r.length == 0) return "<-No errors recorded->"
    for (let i=0; i<r.length; i++) {
        str += `${r[i].testNum},${r[i].str1},${r[i].str2},${r[i].expectedResult},[${r[i].testMatch.score},${r[i].testMatch.pass}]\n`
    }
    return str
}

testIsMatch("./tests.csv")