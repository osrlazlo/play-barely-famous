import './App.css'
import './Buttons.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AdminPage from './components/admin/AdminPage'
import Categories from './components/Categories'
import QuickGameScreen from './components/play/QuickGame'
import { createContext, useContext, useEffect, useState } from 'react'
import { getCategories } from "../../api/functions/getCategories"
import HomePage from './components/HomePage'
import type { Category } from './components/play/interfaces'
import MultiRoundGame from './components/play/MultiRoundGame'

const router = createBrowserRouter([
  {path:"/", element: <HomePage/>},
  {path:"/quick",element: <Categories/>},
  {path:"/admin", element: <AdminPage/>},
  {path:"/quick/play/:id", element: <QuickGameScreen/>},
  {path:"/play", element: <MultiRoundGame/>},
])

interface CategoryContext {
  categories:Category[]
}
export const CategoryContext = createContext<CategoryContext>({categories:[]})

let setThemePlaceholder:React.Dispatch<React.SetStateAction<string>> = ()=>{}
export const ThemeContext = createContext({theme:"", setTheme:setThemePlaceholder})

function App() {

    const [categories, setCategories] = useState<Category[]>([])
    const [theme, setTheme] = useState("")

    useEffect(() => {
        async function loadCategories() {
            const categories = await getCategories()
            setCategories(categories)
        }
        loadCategories()
    },[])

  return (
    <div className={"page-container" + theme}>
    <CategoryContext.Provider value={{categories:categories}}>
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
