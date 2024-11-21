const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return response.error(403, 'Forbidden');
      }
      request.user = user;
      next();
    });
  } else {
    response.error(401, 'Unauthorized');
  }
};

module.exports = authMiddleware;