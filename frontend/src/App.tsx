import './App.css'
import './Buttons.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AdminPage from './components/admin/AdminPage'
import Categories from './components/Categories'
import QuickGame from './components/play/QuickGame'
import { createContext, useContext, useEffect, useState } from 'react'
import { getCategories } from "../../api/functions/getCategories"
import HomePage from './components/HomePage'
import type { Category } from './components/interfaces'
import MultiRoundGame from './components/play/MultiRoundGame'

const router = createBrowserRouter([
  {path:"/", element: <HomePage/>},
  {path:"/quick",element: <Categories/>},
  {path:"/admin", element: <AdminPage/>},
  {path:"/quick/play/:id", element: <QuickGame/>},
  {path:"/play", element: <MultiRoundGame/>},
])

let setCategoriesPlaceholder:React.Dispatch<React.SetStateAction<Category[]>> = ()=>{}
export const CategoryContext = createContext({categories:[] as Category[], setCategories:setCategoriesPlaceholder})

let setStringPlaceholder:React.Dispatch<React.SetStateAction<string>> = ()=>{}
export const ThemeContext = createContext({theme:"", setTheme:setStringPlaceholder})

export const FilterContext = createContext({tagFilter:'', setTagFilter:setStringPlaceholder, sortFilter:'', setSortFilter:setStringPlaceholder})



function App() {

    const [categories, setCategories] = useState<Category[]>([])
    const [theme, setTheme] = useState("")
    const [categoriesStatus, setCategoriesStatus] = useState<number|undefined>(undefined)
    const [tagFilter, setTagFilter] = useState('')
    const [sortFilter, setSortFilter] = useState('')

    useEffect(() => {
        async function loadCategories() {
          console.log('loading categories')
            const res = await getCategories()
            if (res.status == 200) {
              setCategories(res.data.categories as Category[])
            }
            setCategoriesStatus(res.status)     
        }
        if (!categoriesStatus) loadCategories()
    },[])

  return (
    <div className={"page-container" + theme}>
    <FilterContext.Provider value={{tagFilter, setTagFilter, sortFilter, setSortFilter}}>
    <CategoryContext.Provider value={{categories, setCategories}}>
    <ThemeContext.Provider value={{theme, setTheme}}>
      <RouterProvider router={router}/>
    </ThemeContext.Provider>
    </CategoryContext.Provider>
    </FilterContext.Provider>
    </div>
  )
}
export default App

import { MdDarkMode, MdLightMode, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
export function ThemeToggle() {
  const {theme,setTheme} = useContext(ThemeContext)
  const lightTheme = '-light'

  //default theme is dark
  function toggleTheme() {
    setTheme(t => t == lightTheme ? "":lightTheme)
  }

  return(
    <div id={'theme-toggle'+ theme} onClick={()=>toggleTheme()}>
      {theme == lightTheme ? <MdOutlineDarkMode/>:<MdDarkMode/>}
      <div id='bar'>
        <div id='circle'/>
      </div>
      {theme == lightTheme ? <MdLightMode/>:<MdOutlineLightMode/>}
    </div>
  )
}
