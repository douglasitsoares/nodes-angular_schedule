const express = require("express");

const checkAuth = require ("../middleware/check-auth");
const extractFile = require ("../middleware/importfile");
const postController = require("../controllers/posts");

const router = express.Router();

// Applying to try to callback image on the request body
router.post( "", checkAuth, extractFile, postController.postCreate);

router.put("/:id",checkAuth, extractFile, postController.postUpdate);

router.get("", postController.fetchingPosts);

router.get("/:id", postController.postFindId);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
