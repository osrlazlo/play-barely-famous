import Papa from "papaparse"
const API_PATH = import.meta.env.VITE_API_PATH

export async function handleAddCategory(name:string, file:File, source:string) {
    if (!name || !file || !source) return
    console.log(file)
    const data = await parseCSVtoJSON(file)
    console.log("data", data)

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            data,
            source,
    })}
    
    const res = await fetch(`${API_PATH}/add`, options)
    const result = res.json()
    console.log(result)
}

function parseCSVtoJSON(file:File) {
    if (!file) return
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    resolve([...results.data])
                },
                error: (error) => {
                    reject(error)
                }
            })
    })
}