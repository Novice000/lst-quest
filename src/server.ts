import express from "express";
import morgan from "morgan";
import config from "./config";
import connectToDB from "./db/mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello World",
        version: "1.0.0",
        name: "standardisation quest (learnable)"
    })
});

app.listen(config.PORT, async () => {
    await connectToDB();
    console.log("Server started on port "+ config.PORT );
});