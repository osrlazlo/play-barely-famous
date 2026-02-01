import { Response } from "express";

export function setCORSHeaders(res:Response) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
    res.setHeader("Access-Control-Allow-Origin", "https://play-barely-famous-git-preview-osrlazlos-projects.vercel.app")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}