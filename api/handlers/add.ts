import { Request, Response } from "express";
import { setCORSHeaders } from "../helpers.js";
import mongodb, { COL_CATEGORIES } from "../mongodbClient.js";

export default async function handler(req:Request, res:Response) {
    setCORSHeaders(res)
    if (req.method === "OPTIONS") {
        res.status(200).end()
        return
    }

    await mongodb.connectToServer()
    const db = mongodb.getDB() 
    
    try {
        const {name, data, source} = req.body
        const id = await db.collection(COL_CATEGORIES).findOne({next_category_id: {$exists:true}})
        if (!id) throw new Error()
        const updateID = await db.collection(COL_CATEGORIES).updateOne({_id: id._id}, {$set:{next_category_id:Number(id.next_category_id)+1}})
        if (!updateID.acknowledged) throw new Error()

        const mongoCategory = {
            id: Number(id.next_category_id),
            name, 
            data,
            source,
            plays: Number(0),
            dateAdded: new Date()
        }

        let addCategory = await db.collection(COL_CATEGORIES).insertOne(mongoCategory)
        return res.status(200).json(addCategory)
        
    } catch (error) {
        mongodb.closeConnection()
        return res.status(500)
    }
}