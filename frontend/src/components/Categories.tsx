import CategoryCard from "./CategoryCard"
import "./categories.css"
import { Link } from "react-router"
import {CategoryContext} from "../App"
import { Suspense, useContext } from "react"
import Header from "./utils/Header"
import type { Category } from "./play/interfaces"
import ErrorBoundary from "../ErrorBoundary"

export default function Categories() {

    const {categories, status} = useContext(CategoryContext)

    return(
    
        <>
        <Header/>
        <div className="screen">
        <h1>Quick Game</h1>
        <h3>Select a Category</h3>
        <div className='categories-container'> 
            
            <div className="categories">
                <ErrorBoundary fallback='Failed to load categories'>
                    <Suspense fallback="Loading categories...">
                        <CategoriesContainer categories={categories} status={status}/>
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
        </div>
        </>
    )
}

function CategoriesContainer({categories, status}:{categories:Category[], status:number}) {
    if (status != 200) throw new Error('Failed to load categories') 
    return(
        <>
        {categories?.map(c => 
        <Link key={c.id} to={`play/${c.id}`}>
            <CategoryCard  name={c.name} source={c.source} id={c.id} dateAdded={c.dateAdded}/>
        </Link>)}
        </>
     )
}