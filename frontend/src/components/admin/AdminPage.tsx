import { useState, type FormEvent, } from "react"
import "./admin-page.css"
import { handleAddCategory } from "../../../../api/functions/addCategory"
import Header from "../utils/Header"
import Footer from "../utils/Footer"
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import LoadingSpinner from "../utils/LoadingSpinner"

export default function AdminPage() {

    const [name, setName] = useState("")
    const [source, setSource] = useState("")
    const [file,setFile] = useState<File>()
    const [fileName, setFileName] = useState("")
    const [password, setPassword] = useState("")
    const [msg, setMsg] = useState<string|undefined>("")
    const [status, setStatus] = useState<number|undefined>()
    const [tags, setTags] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const addCategory = async (event:FormEvent) => {
        event.preventDefault()
        setIsLoading(true)
        if (!name || !file || !source || !password || !tags) return
        const res = await handleAddCategory(name, file, source, password, tags) 
        setStatus(res?.status)
        const json = await res?.json()
        setIsLoading(false)
        setMsg(json.msg ? json.msg:undefined)
        console.log(res)
    }

    return (
        <>
        <Header/>
        <div className="admin-page">
            <h2>Add a new category</h2>
            {isLoading ? <LoadingSpinner width="24"/>:<div id={"status" + (status && Math.floor(status/100)*100 != 200 ? '-error':'') }>{`${status ? status:''}${msg ? ' - '+msg:''}`}</div>}
            <form id="new-category-form" onSubmit={(e) => {addCategory(e); setMsg(undefined)}}>

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

                <label>Tags (separate by comma):</label>
                <input type="text" placeholder="enter at least one tag" required
                    value={tags} onChange={e => setTags(e.target.value)}></input>

                <label>Admin Password:</label>
                <div id='password-input'> 
                    <input type={showPass ? "text":"password"} required
                        value={password} onChange={e => setPassword(e.target.value)}>  
                    </input>
                    <div id="show-pass-button" onClick={() => setShowPass(s => !s)}>{showPass ? <IoEyeSharp/>:<IoEyeOffSharp/>}</div>
                </div>
               
                <button type="submit">Add new category</button>
            </form>
        </div>
        <Footer/>
        </>
    )
}