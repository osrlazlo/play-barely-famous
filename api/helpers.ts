import { Response } from "express";
const PREVIEW_PATH = process.env.PREVIEW_PATH ? process.env.PREVIEW_PATH:"http://localhost:5173"

export function setCORSHeaders(res:Response) {
    res.setHeader("Access-Control-Allow-Origin", PREVIEW_PATH)
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}