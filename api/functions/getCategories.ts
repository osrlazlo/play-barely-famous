import type { Category } from "../../frontend/src/components/play/interfaces"

const API_PATH = import.meta.env.VITE_API_PATH

export async function getCategories() {
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }
    console.log('fetch',`${API_PATH}/get`)
    const res = await fetch(`${API_PATH}/get`, options)
    console.log(res)
    const result = {status: res.status, data: await res.json()}
    //console.log(result)
    return result
}



