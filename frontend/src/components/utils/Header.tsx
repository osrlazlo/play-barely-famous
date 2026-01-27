import { useLocation } from "react-router";
import { ThemeToggle } from "../../App";
import BackHomeButton from "./BackHomeButtom";

export default function Header() {
    const location = useLocation()
    //console.log('location', location)
    return(
        <div id="sticky-header">
            {location.pathname == "/" ? <div/>:<BackHomeButton/>}
            <ThemeToggle/>
        </div>
    )
}