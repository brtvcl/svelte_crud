import express  from "express";
import multer from "multer";
import db from "../db/index.js";
import path from "path";

const router = express.Router();
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage })



router.get("/",(req,res)=>{
    res.send("Admin Homepage");
})

router.get("/products",(req,res)=>{
    res.send("OK");
});

router.get("/product",async(req,res)=>{
    res.send("OK");
})

router.post("/product",async(req,res)=>{
    let name = req.body.name;
    try {
        let insert = await db.insert(name);
        res.json({message:"OK",insertId:insert.insertId});
    } catch (error) {
        res.send(error)
    }
});

router.put("/product/:id",async(req,res)=>{
    let name = req.body.name;
    let id = req.params.id;
    try {
        let update = await db.update(name, id);
        res.json({message:"OK"});
    } catch (error) {
        res.send(error);
    };
});

router.delete("/product/:id",async(req,res)=>{
    let id = req.params.id;
    try {
        let del = await db.delete(id);
        res.json({message:"OK"});
    } catch (error) {
        res.send(error);
    }
})

router.post("/file_upload", upload.array("files",30), async(req, res)=>{
	let machine_id = req.body.machine_id;
    console.log(machine_id);
	try {
		for (let i = 0; i < req.files.length; i++) {
			const file_name = req.files[i].filename; 
			let insert = await db.file_insert(machine_id, file_name);
		}
		res.send("OK");
	} catch (error) {
		res.send(error);
	}
	
});

router.delete("/file_delete/:file_id",(req,res)=>{
    let file_id = req.params.file_id;
    db.file_delete_single(file_id);
    
    return res.send("OK");
});




export default router;