import "./categories.css"

interface CategoryCardProps {
    id:number|string
    name:string
    dateAdded:Date|string
    source:string
}
export default function CategoryCard({name, dateAdded, source}:CategoryCardProps) {
    return(
        <div className="category-card">
            <span className="name">{name}</span>
            <span className="date-created">Added: {formatDateAdded(dateAdded)}</span>
            <span className="source">Source: {source}</span>
        </div>
    )
}

export function formatDateAdded(date:string|Date) {
    const fromatedDate = `${String(new Date(date).getMonth()+1).padStart(2,"0")}-${new Date(date).getFullYear()}`
    return fromatedDate
}