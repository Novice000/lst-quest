import dotenv from "dotenv";
dotenv.config();

class config {
	static PORT: string = process.env.PORT || "3000";
	static DB_URL: string = process.env.DB_URL || "mongodb://localhost:27017/standardisation-test";
    static SECRET_KEY: string = process.env.SECRET_KEY || "mysecretkey";

}


export default config;