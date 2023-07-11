var express = require("express");
const db = require("../config/db");
var router = express.Router();
var isLoggedIn = require("../middleware/routeprotectors").userIsLoggedIn;
const {
  getRecentPosts,
  getPostById,
} = require("../middleware/postsmiddleware");
const { getCommentsForPost } = require("../models/comments");

/* GET home page. */
router.get("/", getRecentPosts, function (req, res, next) {
  res.render("home", { title: "CSC 317 App", name: "Lucas Soto" });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/registration", (req, res, next) => {
  res.render("registration");
});

router.use("/postimage", isLoggedIn);
router.get("/postimage", (req, res, next) => {
  res.render("postimage");
});

router.get("/viewimage", (req, res, next) => {
  res.render("viewimage");
});

router.get("/posts", (req, res, next) => {
  res.render("viewimage");
});

router.get("/post/:id(\\d+)", getPostById, (req, res, next) => {
  res.render("viewimage", {
    title: `Post ${req.params.id}`,
  });
});

module.exports = router;
