const Post = require("../models/post");

exports.postCreate =
(req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        //...createdPost,
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        creator: createdPost.userId
      }
    });

  }).catch(error =>{
      res.status(500).json({
        message : "Created post is failed!"
      });
  });
}

exports.postUpdate = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath:imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      if(result.n> 0){
        res.status(200).json({ message: "Update successful!" });
      }else{
        res.status(401).json({ message: "Authorization is failed nothing was changed"});
      }
  }).catch(error => {
    res.status(500).json({
      message: "Couldn´t update post autentication failed or issues on the connection!"
    });
  });
}

exports.fetchingPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  //Logic to manipulate page on backend also count quantity of posts on screen
  if (pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit (pageSize);
  }
    postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.count();
      })
      .then( count => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count

      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts is failed!"
      });
    });
  }

exports.postFindId = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  })
  .catch(error => {
      res.status(500).json({
        message: "Fetching post is failed !"
      });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);

    if(result.n > 0){
      res.status(200).json({ message: "Post deleted!" });
    }else{
      res.status(401).json({ message: "Deletion with error!" });
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Error on deletion postId"
    });
  });
}
