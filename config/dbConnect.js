import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect("mongodb+srv://sreeragkunnothuparamba:2hwNTj8T0VzNxWWK@cluster0.6rhujbx.mongodb.net/insurance",{useUnifiedTopology: true,useNewUrlParser:true});
        console.log(`MongodB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error:${error.message}`)
        process.exit(1)
    }
}

export default connectDB