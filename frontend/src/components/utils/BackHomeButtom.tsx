import { Link } from "react-router";

export default function BackHomeButton() {
    return(
        <Link to="/">
           <button id="back-home-button">HOME</button>
        </Link>
    )
}