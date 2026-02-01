import { useState, type FormEvent, } from "react"
import "./admin-page.css"
import { handleAddCategory } from "../../../../api/functions/addCategory"
import Header from "../utils/Header"
import Footer from "../Footer"

export default function AdminPage() {

    const [name, setName] = useState<string>("")
    const [source, setSource] = useState<string>("")
    const [file,setFile] = useState<File>()
    const [fileName, setFileName] = useState<string>("")
    const [password, setPassword] = useState("")
    const [msg, setMsg] = useState("")
    const [status, setStatus] = useState<number|undefined>()

    const addCategory = async (event:FormEvent) => {
        event.preventDefault()
        if (!name || !file || !source || !password) return
        const res = await handleAddCategory(name, file, source, password) 
        setStatus(res?.status)
        const json = await res?.json()
        setMsg(json.msg ? json.msg:undefined)
        console.log(res)
    }

    return (
        <>
        <Header/>
        <div className="admin-page">
            <h2>Add a new category</h2>
            <div id={"status" + (status && Math.floor(status/100)*100 != 200 ? '-error':'') }>{`${status ? status:''}${msg ? ' - '+msg:''}`}</div>
            <form id="new-category-form" onSubmit={(e) => addCategory(e)}>

                <label>Upload .csv file. Must contain headers "rank,name"</label>
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

                <label>Admin Password:</label>
                <input type="password" required
                    value={password} onChange={e => setPassword(e.target.value)}></input>

                <button type="submit">Add new category</button>
            </form>
        </div>
        <Footer/>
        </>
    )
}