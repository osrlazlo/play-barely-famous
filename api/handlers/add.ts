import { Request, Response } from "express";
import { setCORSHeaders } from "../helpers.js";
import mongodb, { COL_CATEGORIES } from "../mongodbClient.js";
import bcrypt from "bcryptjs";
import { Condition, ObjectId } from "mongodb";

export default async function handler(req:Request, res:Response) {
    setCORSHeaders(res)
    if (req.method === "OPTIONS") {
        res.status(200).end()
        return
    }

    await mongodb.connectToServer()
    const db = mongodb.getDB() 
    
    try {
       
       const {name, data, source, password} = req.body
       
       let tags:string[] = []

        /* 
        const hash = await bcrypt.hash(password,10)
        const admin = {
            id:'osrlazlo',
            password:hash,
        }
        const addPassword = await db.collection('admin').insertOne(admin)
        if (!addPassword.acknowledged) throw new Error()
        */

        const admin = await db.collection('admin').findOne({id: 'osrlazlo'}) as Admin
        if (!admin) throw new Error()
        const hash = admin.password
        const isCorrectPassword = await bcrypt.compare(password,hash)
        //console.log(admin, password, hash, isCorrectPassword)
        if (!isCorrectPassword) return res.status(401).json({msg: 'Incorrect password'})

        const categoryExists = await db.collection(COL_CATEGORIES).findOne({name: name})
        if (categoryExists) {

            const updtDate = new Date()
            const updateCat = await db.collection(COL_CATEGORIES).updateOne({_id: categoryExists._id}, {$set:{data: data, dateUpdated: updtDate}})
            
            if (!updateCat.acknowledged) throw new Error()
            else return res.status(200).json({updateCat, msg: 'Category updated'})  

        } else {
        
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
                dateUpdated: new Date(),
                tags
            }

            let addCategory = await db.collection(COL_CATEGORIES).insertOne(mongoCategory)
            return res.status(200).json({addCategory, msg: 'New category created'})  
        }


        
    } catch (error) {
        mongodb.closeConnection()
        let err = error as Error
        return res.status(500).json({msg: `An error occured: ${err.message}`})
    }
}

interface Admin {
    _id:Condition<ObjectId>
    id:string
    password:string
}