const jwt = require ("jsonwebtoken");
const { decode } = require("punycode");

module.exports = (req, res, next) => {
  try{
  /* this can split by Bearer type of Find Postman for token and [1] second parameters URL 0 is empty
      and jwt verify the right token is working or not by the type should be longer
  */
    const token = req.headers.authorization.split(" ")[1];
    //const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch(error){
      res.status(401).json({
        message : "TOKEN you are not authenticated !"
      })
  }
};
