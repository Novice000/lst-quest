import mongoose from "mongoose";
import config from "../config";

async function connectToDB(){
    try{
        await mongoose.connect(config.DB_URL);
        console.log("Connected to MongoDB");
    }catch(err){
        console.error(err);
    }
}

export default connectToDB;