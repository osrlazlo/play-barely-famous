import { Request, Response } from "express";
import mongodb, { COL_CATEGORIES } from "../mongodbClient.js";
import { setCORSHeaders } from "../helpers.js";

export default async function handler(req:Request, res:Response) {
    setCORSHeaders(res)
    if (req.method === "OPTIONS") {
        res.status(200).end()
        return
    }
    
    await mongodb.connectToServer()
    const db = mongodb.getDB()

    try {
        const categories = await db.collection(COL_CATEGORIES).find({next_category_id:{$exists:false}}).toArray()
        if (categories.length < 1) return res.status(404)
        return res.status(200).json(categories)

    } catch (error) {
        console.error(error)
        return res.status(500)
    }
}