import express from "express";
import blogModel from "../models/blogModel.js";
import commentModel from "../models/commentModel.js";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.resolve(`./public/uploads/`));
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();
router.get("/addBlog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/addBlog", upload.single("coverImageUrl"), async (req, res) => {
  const { title, body } = req.body;
  await blogModel.create({
    title,
    body,
    createdBy: req.user.id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  res.redirect("/blog/addBlog");
});

router.get("/:id", async (req, res) => {
  const blog = await blogModel.findById(req.params.id).populate("createdBy");
  const comments = await commentModel.find({ blogId: req.params.id });
  return res.render("blog", {
    blog: blog,
    user: req.user,
    comments: comments,
  });
});
router.post("/comment/:blogId", async (req, res) => {
  const comment = commentModel.create({
    content: req.body.content,
    blogId: req.params.blogId,
    author: req.user?.name,
  });

  res.redirect(`/blog/${req.params.blogId}`);
});
export default router;
