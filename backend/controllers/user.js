const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");


exports.createUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });

    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Credential with error on User or Password !"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed 1"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: fetchedUser._id,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid credentials authentication !"
      });
    });
}