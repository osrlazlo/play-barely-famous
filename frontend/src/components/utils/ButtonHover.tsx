import type { ReactNode } from "react"
import "./button-hover.css"

interface ButtonHoverProps {
    children:ReactNode
}

export default function ButtonHover({children}:ButtonHoverProps) {
    return(
        <div className="button-hover-outer">
            <div className="button-hover-inner">
                {children}
            </div>
        </div>
    )
}