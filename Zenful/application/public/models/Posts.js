var db = require("../config/db");

const PostModel = {};

PostModel.create = (title, description, photopath, thumbnail, fk_userId) => {
  let baseSQL =
    "INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userId) VALUE (?,?,?,?,now(),?);";
  return db
    .execute(baseSQL, [title, description, photopath, thumbnail, fk_userId])
    .then(([results, fields]) => {
      return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
  let baseSQL =
    "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack \
        FROM posts \
        having haystack like ?;";
  let sqlReadySearchTerm = "%" + searchTerm + "%";
  return db
    .execute(baseSQL, [sqlReadySearchTerm])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getNRecentPosts = (numberOfPosts) => {
  let baseSQL = `SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 16`;
  return db
    .execute(baseSQL, [numberOfPosts])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
  let baseSQL = `SELECT u.username, p.title, p.description, p.photopath, p.created
  FROM users u
  JOIN posts p
  ON u.id=p.fk_userId 
  WHERE p.id=?;`;

  return db
    .execute(baseSQL, [postId])
    .then(([results, fields]) => {
      return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

module.exports = PostModel;
