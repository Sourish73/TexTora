const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
  

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing"
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Invalid token"
    });
  }
};
