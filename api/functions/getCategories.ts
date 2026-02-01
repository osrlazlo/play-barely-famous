import type { Category } from "../../frontend/src/components/play/interfaces"

const API_PATH = import.meta.env.VITE_API_PATH
export async function getCategories() {
    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }

    let result
    try {
        console.log('fetch',`${API_PATH}/get`)
        const res = await fetch(`${API_PATH}/get`, options)
        let data
        if (res.ok) data = await res.json()
        else throw new Error()
        result = {status: res.status, data, msg: res.statusText}
        return result
        
    } catch (error) {
        // console.log('get',error)
        result = {status: 500, data:undefined, msg: error}
        return result
    }
}



