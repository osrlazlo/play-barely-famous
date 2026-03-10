import CategoryCard from "./CategoryCard"
import "./categories.css"
import { Link } from "react-router"
import {CategoryContext, FilterContext} from "../App"
import { Suspense, useContext, useEffect, useState } from "react"
import Header from "./utils/Header"
import type { Category } from "./interfaces"
import ErrorBoundary from "../ErrorBoundary"
import { getCategories } from "../../../api/functions/getCategories"
import Footer from "./utils/Footer"
import LoadingSpinner from './utils/LoadingSpinner'
import { IoIosCloseCircle } from "react-icons/io";

export default function CategoriesWrapper() {
    return(
        <>
        <Header/>
        <div className="screen">
        <h1>Quick Game</h1>
        <h3>Select a Category</h3>
        <div className='categories-container'> 

            <ErrorBoundary fallback='Failed to load categories'>
                    <Categories/>
            </ErrorBoundary>

        </div>
        </div>
        <Footer/>
        </>
    )
}

function Categories() {
    const {categories, setCategories} = useContext(CategoryContext)
    const [error, setError] = useState<Error|null>(null)
    const [isLoading,setIsLoading] = useState(false)
    const {tagFilter, sortFilter} = useContext(FilterContext)

    //load categories if not loaded yet
    useEffect(() => {
        async function loadCategories() {
            setIsLoading(true)
            //console.log('res', res)
            try {
                const res = await getCategories()
                if (res.status == 200) {
                    let categories = res.data.categories as Category[]
                    setCategories(categories)
                    setIsLoading(false)
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
        {isLoading ? 
        <LoadingSpinner width='96'/>
        : 
        <>
            <TagFilter/>
            <div className="categories">
            {tagFilter ? 
                sortCategories(categories, sortFilter).filter(c => c.tags?.find(t => t==tagFilter)).map(c => 
                <Link key={c.id} to={`play/${c.id}`}>
                    <CategoryCard  name={c.name} source={c.source} id={c.id} dateUpdated={c.dateUpdated} tags={c.tags}/>
                </Link>)
                :sortCategories(categories, sortFilter).map(c => 
                <Link key={c.id} to={`play/${c.id}`}>
                    <CategoryCard  name={c.name} source={c.source} id={c.id} dateUpdated={c.dateUpdated} tags={c.tags}/>
                </Link>)}
            </div>
        </>}
        </>
     )
}

export function TagFilter() {
    const [tags, setTags] = useState<string[]>([]) // = ['celebrities', 'cinema', 'entertainment', 'family', 'finance', 'music', 'sports', 'video games']
    const sortOptions = ['recent', 'A-Z']
    const {tagFilter, setTagFilter, sortFilter, setSortFilter} = useContext(FilterContext)
    const {categories} = useContext(CategoryContext)

    useEffect(()=>{
        setSortFilter(sortOptions[0])
        let tagSet = new Set<string>()
        categories?.map(c => [...c.tags!].map(t => tagSet.add(t)))
        setTags([...tagSet].sort((a, b) => a.localeCompare(b)))
    },[])

    return(
        <div className="filters">
            <div className="filter">
                <label>Tags: </label>
                <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
                    <option value=''>All</option>
                    {tags!.map(t => <option key={t} value={t}>{t[0].toUpperCase()+t.substring(1)}</option>)}
                </select>            
                <div className="reset-filters-button">
                    <IoIosCloseCircle onClick={() => setTagFilter('')}/>  
                </div>
            </div>
            <div className="filter">
                <label>Sort: </label>
                <select value={sortFilter} onChange={e => setSortFilter(e.target.value)}>
                    {sortOptions.map(t => <option key={t} value={t}>{t[0].toUpperCase()+t.substring(1)}</option>)}
                </select>
                <div className="reset-filters-button">
                    <IoIosCloseCircle onClick={() => setSortFilter(sortOptions[0])}/>  
                </div>
            </div>
        </div>
    )
}

export function sortCategories(categories:Category[], sort:string) {
    let categories_sorted = [...categories]
    if (sort == 'recent') {
        categories_sorted.sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime())
    }
    else if (sort == 'A-Z') {
        categories_sorted.sort((a, b) => a.name.localeCompare(b.name))
    }
    return categories_sorted
}