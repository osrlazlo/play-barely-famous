import CategoryCard from "./CategoryCard"
import "./categories.css"
import { Link } from "react-router"
import {CategoryContext} from "../App"
import { useContext } from "react"
import Header from "./utils/Header"

export default function Categories() {

    const {categories} = useContext(CategoryContext)

    return(
    
        <>
        <Header/>
        <div className="screen">
        <h1>Quick Game</h1>
        <h3>Select a Category</h3>
        <div className='categories-container'> 
            
            <div className="categories">
                
                {categories?.map(c => 
                    <Link key={c.id} to={`play/${c.id}`}>
                        <CategoryCard  name={c.name} source={c.source} id={c.id} dateAdded={c.dateAdded}/>
                    </Link>)}
            </div>
        </div>
        </div>
        </>
    )
}