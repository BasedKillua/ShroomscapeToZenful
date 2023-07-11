var express = require("express");
var router = express.Router();
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
var sharp = require("sharp");
var multer = require("multer");
var crypto = require("crypto");
var PostError = require("../helpers/error/PostError");
var PostModel = require("../models/Posts");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads");
  },
  filename: function (req, file, cb) {
    let fileExt = file.mimetype.split("/")[1];
    let RandomName = crypto.randomBytes(22).toString("hex");
    cb(null, `${RandomName}.${fileExt}`);
  },
});

var uploader = multer({ storage: storage });

router.post("/createPost", uploader.single("chooseImage"), (req, res, next) => {
  let fileUploaded = req.file.path;
  let fileAsThumbnail = `thumbnail-${req.file.filename}`;
  let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
  let title = req.body.title;
  let description = req.body.description;
  let fk_userId = req.session.userId;

  sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
      return PostModel.create(
        title,
        description,
        fileUploaded,
        destinationOfThumbnail,
        fk_userId
      );
    })
    .then((postWasCreated) => {
      if (postWasCreated) {
        successPrint("if true");
        req.flash("success", "Your post was created successfully!");
        res.redirect("/");
      } else {
        resp.json({
          status: "OK",
          message: "post was not created",
          redirect: "/postimage",
        });
      }
    })
    .catch((err) => {
      if (err instanceof PostError) {
        errorPrint(err.getMessage());
        req.flash("error", err.getMessage());
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });
});

//localhost:3000/posts/search?search=value
router.get("/search", async (req, res, next) => {
  try {
    let searchTerm = req.query.search;
    if (!searchTerm) {
      res.send({
        message: "No search term given",
        results: [],
      });
    } else {
      let results = await PostModel.search(searchTerm);
      if (results.length) {
        res.send({
          message: `${results.length} results found`,
          results: results,
        });
      } else {
        let results = await PostModel.getNRecentPosts(8);
        res.send({
          message:
            "No results were found for your search but her are the 8 most recent posts",
          results: results,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
