import { useContext } from "react"
import "./categories.css"
import { ThemeContext } from "../App"

interface CategoryCardProps {
    id:number|string
    name:string
    dateUpdated:Date|string
    source:string
    tags?:string[]
}
export default function CategoryCard({name, dateUpdated, source, tags}:CategoryCardProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <div className={"category-card" + theme}>
            <span className="name">{name}</span>
            <span className="date-created">Updated: {formatDateAdded(dateUpdated)}</span>
            <span className="source">Source: {source}</span>
            <span className="tags">
               {tags ? <>Tags: {tags.map(t => <span className="tag" key={t}>{t[0].toUpperCase()+t.substring(1)}</span>)}</>:""} 
            </span>
        </div>
    )
}

export function formatDateAdded(date:string|Date) {
    const fromatedDate = `${String(new Date(date).getMonth()+1).padStart(2,"0")}-${new Date(date).getFullYear()}`
    return fromatedDate
}