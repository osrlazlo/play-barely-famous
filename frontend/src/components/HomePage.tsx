import { Link } from "react-router";
import "../App.css"
import ButtonWrapper from "./play/utils/ButtonWrapper";
import Header from "./utils/Header";
import { useContext } from "react";
import { ThemeContext } from "../App";
import Footer from "./Footer";

export default function HomePage() {
    const {theme} = useContext(ThemeContext)
    return (
        <>
        <Header/>
        <div className="home-page">
            <div> 
                <h1>BARELY FAMOUS!</h1>
                <h3>A game where lower is better!</h3>
                <p>
                    Guess items on a list closest to #100
                </p>
                <ButtonWrapper>
                    <Link to={"/play"}><button className="play-button">PLAY</button></Link>
                </ButtonWrapper>
                <ButtonWrapper>
                    <Link to={"/quick"}><button className="quick-button">QUICK GAME</button></Link>  
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

            <div className={"embed-video"+theme}>
                <h4>Credits for the game concept go to SIDEMEN (probably Simon's idea)</h4>
                <iframe width="560" height="315" 
                    src="https://www.youtube.com/embed/qcD8nbFwVfU?si=wi4luOio5038RaQO" 
                    title="YouTube video player" 
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen></iframe>
            </div>
        </div>
        <Footer/>
        </>
    )
}