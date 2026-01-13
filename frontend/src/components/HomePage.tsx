import { Link } from "react-router";
import "../App.css"

export default function HomePage() {
    return (
    <div className="home-page"> 
    <h1>BARELY FAMOUS!</h1>
    <h3>A game where lower is better!</h3>
    <p>
        Guess items on a list closest to #100
    </p>
        <Link to={"/play"}><button className="play-button">PLAY</button></Link>
        <Link to={"/quick"}><button className="play-button">QUICK GAME</button></Link>
        <div className="instructions">
            <h3>How to play</h3>
            <p>
                Enter a guess for the category
            <br/>The lower it is in the top 100, the more points you get
            <br/>But be careful, if you go too far (even #101) you get ZERO points
            </p>
        </div>
    </div>
    )
}