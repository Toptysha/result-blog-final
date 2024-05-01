const { populate } = require("dotenv");
const Post = require("../models/Post");

async function addPost(post) {
  const newPost = await Post.create(post);

  await newPost.populate({ path: "comments", populate: "author" });

  return newPost;
}

async function editPost(id, post) {
  const newPost = await Post.findByIdAndUpdate(id, post, {
    returnDocument: "after",
  });

  await newPost.populate({ path: "comments", populate: "author" });

  return newPost;
}

function deletePost(id) {
  return Post.deleteOne({ _id: id });
}

function getPost(id) {
  return Post.findById(id).populate({ path: "comments", populate: "author" });
}

async function getPosts(search = "", limit = 10, page = 1) {
  const [posts, countPosts] = await Promise.all([
    Post.find({ title: { $regex: search, $options: "i" } })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 }),
    Post.countDocuments({ title: { $regex: search, $options: "i" } }),
  ]);

  return {
    posts,
    lastPage: Math.ceil(countPosts / limit),
  };
}

module.exports = { addPost, editPost, deletePost, getPost, getPosts };
