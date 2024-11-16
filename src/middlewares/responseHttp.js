/**
 * Middleware que agrega métodos de respuesta personalizados al objeto de respuesta (res).
 * 
 * @function responseMiddleware
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP. Se le añaden los métodos `success` y `error`.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * 
 * @returns {void}
 */
function responseMiddleware(req, res, next) {
   /**
    * Envía una respuesta de éxito con un objeto de datos.
    * 
    * @function success
    * @param {Object} data - Los datos a enviar en la respuesta. Puede ser un Object, String, Number, Array. NO aplica para documentos
    * @returns {void}
    */
   res.success = function (data) {
      res.send({
         success: true,
         data
      });
   };

   /**
    * Envía una respuesta de error con un código de estado y un mensaje.
    * 
    * @function error
    * @param {number} [code=500] - Código de estado HTTP a enviar. Por defecto es 500. https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    * @param {string|string[]} message - Mensaje o lista de mensajes de error.
    * @returns {void}
    */
   res.error = function (code = null, message = null) {
      res.status(code || 500);
      res.json({
         success: false,
         error: Array.isArray(message) ? message : message
      });
   };

   // TODO: res.file()

   next();
}

module.exports = responseMiddleware;
