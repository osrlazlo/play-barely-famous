import { useContext, type ReactElement } from "react"
import { ThemeContext } from "../../../App"

interface ButtonWapperProps {
    children:ReactElement
}
export default function ButtonWrapper({children}:ButtonWapperProps) {
    const {theme} = useContext(ThemeContext)
    return(
        <div className={"button-wrapper" + theme}>
            {children}
        </div>
    )
}