import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AdminPage from './components/admin/AdminPage'
import Categories from './components/Categories'
import QuickGameScreen from './components/play/QuickGame'
import { createContext, useEffect, useState } from 'react'
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

function App() {

    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        async function loadCategories() {
            const categories = await getCategories()
            setCategories(categories)
        }
        loadCategories()
    },[])

  return (
    <div className="page-container">
    <CategoryContext.Provider value={{categories:categories}}>
      <RouterProvider router={router}/>
    </CategoryContext.Provider>
    </div>
  )
}

export default App
