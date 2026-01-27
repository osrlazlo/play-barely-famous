import { useContext } from "react"
import "./categories.css"
import { ThemeContext } from "../App"

interface CategoryCardProps {
    id:number|string
    name:string
    dateAdded:Date|string
    source:string
}
export default function CategoryCard({name, dateAdded, source}:CategoryCardProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <div className={"category-card" + theme}>
            <span className="name">{name}</span>
            <span className="date-created">Updated: {formatDateAdded(dateAdded)}</span>
            <span className="source">Source: {source}</span>
        </div>
    )
}

export function formatDateAdded(date:string|Date) {
    const fromatedDate = `${String(new Date(date).getMonth()+1).padStart(2,"0")}-${new Date(date).getFullYear()}`
    return fromatedDate
}