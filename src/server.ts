import express from "express";
import morgan from "morgan";
import config from "./config";
import connectToDB from "./db/mongodb";
import AllController from "./controllers/all.controller";
import { validateCard } from "./middlewares/card.validator";
import { validateUserBody } from "./middlewares/user.validator";
import { errorHandler } from "./middlewares/error.handler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Hello World",
		version: "1.0.0",
		name: "standardisation quest (learnable)",
	});
});

app.post("/api/create-account", validateUserBody, AllController.CreateUserAndAccount);
app.get("/api/get-all-accounts", AllController.getAllAccounts);
app.post("/api/decrypt-card-details", validateCard, AllController.decryptCardDetails);


app.use(errorHandler);

app.listen(config.PORT, async () => {
	await connectToDB();
	console.log("Server started on port " + config.PORT);
});
