import { Link } from "react-router";
import "../App.css"
import ButtonWrapper from "./play/utils/ButtonWrapper";
import Header from "./utils/Header";

export default function HomePage() {
    return (
        <>
        <Header/>
        <div className="home-page"> 
        <h1>BARELY FAMOUS!</h1>
        <h3>A game where lower is better!</h3>
        <p>
            Guess items on a list closest to #100
        </p>
            <ButtonWrapper>
                <Link to={"/play"}><button className="play-button">PLAY</button></Link>
            </ButtonWrapper>
            <ButtonWrapper>
                <Link to={"/quick"}><button className="play-button">QUICK GAME</button></Link>  
            </ButtonWrapper>
            
            <div className="instructions">
                <h3>How to play</h3>
                <p>
                    Enter a guess for the category
                <br/>The lower it is in the top 100, the more points you get
                <br/>But be careful, if you go too far (even #101) you get ZERO points
                </p>
            </div>
        </div>
        </>
    )
}