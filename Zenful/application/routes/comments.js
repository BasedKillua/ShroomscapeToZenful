var express = require("express");
var router = express.Router();
// var db = require('../config/db');
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
const { create } = require("../models/comments");

router.post("/create", (req, res, next) => {
  if (req.session.username) {
    errorPrint("must be logged in to comment");
    req.json({
      code: -1,
      status: "danger",
      message: "Must be logged in to create a comment",
    });
  } else {
  }
  let { comment, postId } = req.body;
  let username = "myuser12";
  let userId = 33;

  create(userId, postId, comment).then((wasSuccessful) => {
    if (wasSuccessful !== -1) {
      successPrint(`comment was created for ${username}`);
      res.json({
        code: 1,
        status: "success",
        message: "comment created",
        comment: comment,
        username: username,
      });
    } else {
      errorPrint("comment was not saved");
      res.json({
        code: -1,
        status: "danger",
        message: "comment was not created",
      });
    }
  });
});

module.exports = router;
