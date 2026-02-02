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

let setThemePlaceholder:React.Dispatch<React.SetStateAction<string>> = ()=>{}
export const ThemeContext = createContext({theme:"", setTheme:setThemePlaceholder})

function App() {

    const [categories, setCategories] = useState<Category[]>([])
    const [theme, setTheme] = useState("")
    const [categoriesStatus, setCategoriesStatus] = useState<number|undefined>(undefined)

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
    <CategoryContext.Provider value={{categories:categories, setCategories: setCategories}}>
    <ThemeContext.Provider value={{theme:theme, setTheme:setTheme}}>
      <RouterProvider router={router}/>
    </ThemeContext.Provider>
    </CategoryContext.Provider>
    </div>
  )
}
export default App

import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
export function ThemeToggle() {
  const {theme,setTheme} = useContext(ThemeContext)

  //default theme is dark
  function toggleTheme() {
    setTheme(t => t == "-light" ? "":"-light")
  }

  return(
    <div id={'theme-toggle'+ theme} onClick={()=>toggleTheme()}>
      <MdOutlineDarkMode/>
      <div id='bar'>
        <div id='circle'/>
      </div>
      <MdOutlineLightMode/>
    </div>
  )
}
