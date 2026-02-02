import CategoryCard from "./CategoryCard"
import "./categories.css"
import { Link } from "react-router"
import {CategoryContext} from "../App"
import { Suspense, useContext, useEffect, useState } from "react"
import Header from "./utils/Header"
import type { Category } from "./interfaces"
import ErrorBoundary from "../ErrorBoundary"
import { getCategories } from "../../../api/functions/getCategories"
import Footer from "./Footer"

export default function CategoriesWrapper() {
    return(
        <>
        <Header/>
        <div className="screen">
        <h1>Quick Game</h1>
        <h3>Select a Category</h3>
        <div className='categories-container'> 
            
            <div className="categories">
                <ErrorBoundary fallback='Failed to load categories'>
                        <Categories/>
                </ErrorBoundary>
            </div>
        </div>
        </div>
        <Footer/>
        </>
    )
}

function Categories() {
    const {categories, setCategories} = useContext(CategoryContext)
    const [error, setError] = useState<Error|null>(null)

    //load categories if not loaded yet
    useEffect(() => {
        async function loadCategories() {
            const res = await getCategories()
            //console.log('res', res)
            try {
                if (res.status == 200) {
                    let categories = res.data.categories as Category[]
                    setCategories(categories)
                } 
                else setError(new Error(`{"status": "${res.status}", "msg": "${res.msg}"}`)) 
                
            } catch (error) {
                setError(error as Error)
            } 
        }
        if (!(categories.length > 0)) loadCategories()
    },[])

    if (error) throw error

    return(
        <>
        {categories?.map(c => 
        <Link key={c.id} to={`play/${c.id}`}>
            <CategoryCard  name={c.name} source={c.source} id={c.id} dateUpdated={c.dateUpdated} tags={c.tags}/>
        </Link>)}
        </>
     )
}