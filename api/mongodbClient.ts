import {MongoClient, Db} from "mongodb"

let URI = process.env.ATLAS_URI
let client:MongoClient
let database:Db
let cachedDB: Db | null = null
let cachedClient: MongoClient | null = null

export const COL_CATEGORIES = process.env.COL_CATEGORIES ? process.env.COL_CATEGORIES : "categories"

const mongodb = {
    connectToServer: async () => {
        if (cachedDB && cachedClient) {
            client = cachedClient
            database = cachedDB
            return
        }

        if (!URI) throw new Error("Missing URI")
        client = new MongoClient(URI)
        await client.connect()
        database = client.db("barely-famous")

        cachedClient = client
        cachedDB = database
    },

    getDB: () => {
        return database
    },

    closeConnection: async () => {
        if (client) await client.close()
    }
}
export default mongodb