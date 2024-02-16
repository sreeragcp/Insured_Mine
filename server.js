import express from "express"
import cors from "cors"
import connectDB from "./config/dbConnect.js";
import router from "./route/route.js";
import fileUpload from "express-fileupload";




const app = express()

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use(cors({ origin: true, credentials: true }));
app.use(fileUpload())


app.use('/',router)

const port =5000
app.listen(port,()=>{
    console.log("server running")
})


connectDB()



