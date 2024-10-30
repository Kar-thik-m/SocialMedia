import express from "express";
import connectToDb from "./Database/Database.js";
import userRouter from "./Router/UserRouter.js";
import CommentRouter from "./Router/CommentRouter.js";
import Postrouter from "./Router/PostRouter.js";
import MessageRouter from "./Router/MessageRouter.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { app,server } from "./Socket/Socketio.js";
import cors from "cors";

connectToDb();
dotenv.config();


cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});


app.use(express.json());


app.use(cors());

app.use("/user", userRouter);
app.use("/item", Postrouter);
app.use("/comment",CommentRouter)
app.use("/messageuser",MessageRouter)


app.get("/", (req, res) => {
  res.send("Hello World");
});


server.listen(3000, () => {
  console.log("Server running on port 4000");
});