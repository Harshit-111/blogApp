import "dotenv/config";
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import path from "path";
import userRouter from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import cookieParser from "cookie-parser";
import { checkForAuthCookie } from "./middlewares/authMiddleware.js";

import blogModel from "./models/blogModel.js";

const app = express();
const port = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use("/", userRouter);
app.use("/blog", blogRoutes);
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await blogModel.find({}).sort("createdAt");
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
const DBurl = process.env.MONGO_URL;
mongoose.connect(DBurl).then(() => {
  console.log("database connected");
});

app.listen(port, () => {
  console.log("server running....");
});
