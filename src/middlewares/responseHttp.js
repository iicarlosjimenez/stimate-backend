function responseMiddleware(req, res, next) {
   res.success = function (data) {
      res.send({
         success: true,
         data
      });
   };

   res.error = function ({ code = null, message }) {
      res.status(code || 500);
      res.json({
         success: false,
         error: Array.isArray(message) ? message : message
      });
   };

   next();
}

module.exports = responseMiddleware;
