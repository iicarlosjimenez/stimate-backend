// Validation
function validator(rules, data) {
   let validated = true
   let messages = []

   Object.entries(rules).forEach(([key, value]) => {
      value.forEach(rule => {
         switch (rule) {
            case 'required':
               if (!data.hasOwnProperty(key)) {
                  validated = false
                  messages.push(`The field ${key} is required`)
               } else {
                  if (!data[key]) {
                     validated = false
                     messages.push(`The field ${key} is required`)
                  }
               }
               break;
            case 'number':
               if (isNaN(data[key])) {
                  validated = false
                  messages.push(`The field ${key} is not a number`)
               }
               break;
            case 'string':
               if (typeof data[key] !== 'string') {
                  validated = false
                  messages.push(`The field ${key} is not a string`)
               }
               break;
            case 'boolean':
               if (typeof data[key] !== 'boolean') {
                  validated = false
                  messages.push(`The field ${key} is not a boolean`)
               }
               break;
            case 'array':
               if (!Array.isArray(data[key])) {
                  validated = false;
                  messages.push(`The field ${key} is not an array`);
               }
               break;
            case 'email':
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!emailRegex.test(data[key])) {
                  validated = false;
                  messages.push(`The field ${key} is not an email`);
               }
               break;
            default:
               break;
         }
      });
   });

   return {
      validated,
      messages
   }
}

module.exports = validator
