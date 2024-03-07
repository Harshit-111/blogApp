import express from "express";
import userModel from "../models/userModel.js";

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signinPage");
});
router.get("/signup", (req, res) => {
  return res.render("signupPage");
});
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await userModel.create({
    fullName,
    email,
    password,
  });

  res.redirect("/");
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const token = await userModel.matchPasswordandGenerateToken(email, password);
  if (token == 1)
    return res.render("signupPage", {
      error: "user does not exist login first",
    });
  if (token == 2)
    return res.render("signinPage", {
      error: "incorrect password",
    });

  res.cookie("token", token).redirect("/");
});

export default router;
