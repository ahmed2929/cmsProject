const jwt = require("jsonwebtoken");

exports.authorization = (...roles) => {
  return (req, res, next) => {
    try {
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
        req.decodedToken=decodedToken;
        next();
      }
    } catch {
      res.status(401).json({
        error: "Unauthorized",
        status: "error",
      });
    }
  };
};
