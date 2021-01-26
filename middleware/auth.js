const jwt = require("jsonwebtoken");

exports.authorization = (...roles) => {
  return (req, res, next) => {
    try {

      console.debug("auth run")

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const role = decodedToken.role;
     
      if (!roles.includes(role)) {
        console.debug("filed due to role ")
        return res.status(401).json({
          error: "Unauthorized",
          status: "error",
        });
      } else {
        console.debug("auth passed")
        req.decodedToken=decodedToken;
        next();
      }
    } catch (err){
      console.debug(err)
      res.status(401).json({
        error: "Unauthorized",
        status: "error",
      });
    }
  };
};
