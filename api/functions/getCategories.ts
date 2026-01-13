import type { Category } from "../../frontend/src/components/play/interfaces"

const API_PATH = import.meta.env.VITE_API_PATH

export async function getCategories() {
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }

    const res = await fetch(`${API_PATH}/get`, options)
    const result = await res.json() as Category[]
    //console.log(result)
    return result
}



