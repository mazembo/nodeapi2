// requiring dependencies
const express = require("express");
const jwt = require("jsonwebtoken");

// initialising my app

const app = express();

//defining some routes for my app object
app.get("/api", (req, res)=>{
  res.json({
    message: "Welcome to the API"
  })
})
app.post("/api/login", (req, res)=>{
  //Normally the user sends credentials and the app checks in the db and initialises a session for the user
  //Mock user
  const user = {
    id: 1,
    username: "eddy",
    email: "mazemb_eddy@yahoo.fr"
  }
  // now the login user will be provided with a token
  jwt.sign({user: user}, "secretkey",{expiresIn: '60s'}, (err, token)=> {
    res.json({
      token: token
    })
  })
})
app.post("/api/posts", verifyToken, (req, res)=>{
  jwt.verify(req.token, 'secretkey', (err, authData)=>{
    if (err){
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post Created",
        authData
      })
    }
  })
})
function verifyToken(req, res, next){
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();

  } else {
    //Forbidden
    res.sendStatus(403);
  }
}

//launching server
app.listen(5000, () => {
  console.log("Server is up and running on port 5000")
})
