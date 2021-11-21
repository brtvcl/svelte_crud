import express, { application } from "express";
import cors from "cors";

const app = express();
//Middle-ware
app.use(express.json());
app.use(cors());
app.use("/uploads",express.static("uploads"));

//Routes
import products from "./routes/products.js";
app.use("/products", products);
import admin from "./routes/admin.js";
app.use("/admin", admin);

app.get("/", (req,res)=>{
    res.send("Hello World!");
});




app.listen(5000, ()=>{console.log("Listening to port 5000")});