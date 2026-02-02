import type { Category } from "../interfaces";

interface TopAnswersProps {
    category:Category
}

export default function TopAnswers({category}:TopAnswersProps) {
    const min = 90
    const max  = 100
    return(
        <div className="top-answers">
            <div className="title">Top Answers</div>
            <div className="container">
            {category?.data
                .filter(e => e.rank >= min && e.rank <= max)
                .sort((a,b) => b.rank - a.rank)
                .map(e => 
                <div className="top-answers-element" key={e.rank}>
                    <div className="name">{e.name}</div>
                    <div className="rank">{e.rank}</div>
                </div>)}
            </div>
        </div>
    )

}