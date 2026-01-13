import { useState, type FormEvent, } from "react"
import "./admin-page.css"
import { handleAddCategory } from "../../../../api/functions/addCategory"

export default function AdminPage() {

    const [name, setName] = useState<string>("")
    const [source, setSource] = useState<string>("")
    const [file,setFile] = useState<File>()
    const [fileName, setFileName] = useState<string>("")

    const addCategory = (event:FormEvent) => {
        event.preventDefault()
        if (!name || !file || !source) return
        handleAddCategory(name, file, source)  
    }

    return (
        <div className="admin-page">
            <h2>Add a new category</h2>
            <form id="new-category-form" onSubmit={(e) => addCategory(e)}>

                <label>Upload .csv file. Must contain format "Rank,Name"</label>
                <input type="file" accept=".csv" required
                    value={fileName} onChange={e => {
                        setFile(e.target.files![0]) 
                        setFileName(e.target.value)}}></input>

                <label>Category Name:</label>
                <input type="text" placeholder="name" required
                    value={name} onChange={e => setName(e.target.value)}></input>

                <label>Data source:</label>
                <input type="text" placeholder="source" required
                    value={source} onChange={e => setSource(e.target.value)}></input>

                <button type="submit">Add new category</button>
            </form>
        </div>
    )
}