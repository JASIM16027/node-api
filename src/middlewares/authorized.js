const jwt = require('jsonwebtoken');
require('dotenv').config()
const verifyToken = (req, res, next) => {
  //console.log(process.env.JWT_SECRET)
  const {authorization} = req.headers
  if(!authorization){
    return res.status(401).send({error:'A Token is required for authentication!'})
  }
  try {
    const token = authorization.split(" ")[1];
    // console.log(token)
    // console.log(process.env.JWT_SECRET)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const email = decodedToken.email;
    const userId = decodedToken.userId;

    //console.log(userId)
    //console.log(process.env.JWT_SECRET)
    req.email = email
    req.userId = userId;
    
    next();
  } catch {
    next('Invalid token');
  }
};
module.exports = verifyToken;
