function success({ response, data, message = '' }) {
   response.send({
      success: true,
      data: {
         data
      }
   })
}

function error({ response, code = null, message }) {
   response.status(code || 500);
   response.json({
      success: false,
      error: message
   });
}

module.exports = {
   success,
   error
}
