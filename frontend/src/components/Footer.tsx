import { useContext } from "react"
import { FaGithub, FaTwitter } from "react-icons/fa"
import { ThemeContext } from "../App"

export default function Footer() {
    const date = new Date()
    const {theme} = useContext(ThemeContext)
    return (
        <div id="footer">
            <div id="footer-content">
                <p>&copy; {date.getFullYear()} Developped by @osrlazlo</p>
                <a href="https://github.com/osrlazlo" target="blank">
                    <div className={"footer-icon" + theme}>
                    <FaGithub/>
                    </div>
                </a>
                <a href="https://x.com/osrlazlo" target="blank">
                    <div className={"footer-icon" + theme}>
                    <FaTwitter/>
                    </div>
                </a>
            </div>
            
        </div>
    )
}