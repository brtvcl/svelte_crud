import express  from "express";
import path from "path";
import db from "../db/index.js";

const router = express.Router();


router.get("/",async (req, res)=>{
    try {
        let products = await db.all();
        return res.json(products);
    } catch (error) {
        return res.send(error);
    }
});


router.get("/image/:filename",async(req, res)=>{
    const filename = req.params.filename;
    const dirname = path.resolve();
    const filepath = path.join(dirname, "uploads/" + filename);
    return res.sendFile(filepath);
})

export default router;