const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
 
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/signin');
      } else {
        console.log(decodedToken);
        next();
      }
    })


  } else {
 
    res.redirect('/signin');

  }
}

 

const clearJWT = (req, res, next) => {
  res.clearCookie('jwt');
  next();
};



module.exports = { requireAuth, clearJWT };
