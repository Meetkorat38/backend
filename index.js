import express from "express";
import dotenv from "dotenv";
import { mongoDB } from "./db/db.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import user from "./routes/user.route.js";
import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Here we configure monoDB connection

mongoDB();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/api/v1/user", user);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("listening on port " + port);
});
