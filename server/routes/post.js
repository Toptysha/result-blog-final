const express = require("express");
const {
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
} = require("../controllers/post");
const { addComment, deleteComment } = require("../controllers/comment");
const authenticated = require("../middlewares/authenticated");
const hasRole = require("../middlewares/hasRole");
const mapPost = require("../helpers/mapPost");
const mapComment = require("../helpers/mapComment");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const { posts, lastPage } = await getPosts(
      req.query.search,
      req.query.limit,
      req.query.page
    );
    res.send({ error: null, data: { posts: posts.map(mapPost), lastPage } });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await getPost(req.params.id);
    res.send({ error: null, data: mapPost(post) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.post("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const newPost = await addPost({
      title: req.body.title,
      image: req.body.imageUrl,
      content: req.body.content,
    });

    res.send({ data: mapPost(newPost) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.patch(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    const updatedPost = await editPost(req.params.id, {
      title: req.body.title,
      image: req.body.imageUrl,
      content: req.body.content,
    });

    res.send({ data: mapPost(updatedPost) });
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    await deletePost(req.params.id);

    res.send({ error: null, data: null });
  }
);

router.post("/:id/comments", authenticated, async (req, res) => {
  try {
    const newComment = await addComment(req.params.id, {
      content: req.body.content,
      author: req.user.id,
    });
    res.send({ data: mapComment(newComment) });
  } catch (err) {
    res.send({ error: err.message || "Unknown Error" });
  }
});

router.delete(
  "/:postId/comments/:commentId",
  authenticated,
  hasRole([ROLES.ADMIN, ROLES.MODERATOR]),
  async (req, res) => {
    await deleteComment(req.params.postId, req.params.commentId);

    res.send({ error: null, data: null });
  }
);

module.exports = router;
