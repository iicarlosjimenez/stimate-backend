const mongoose = require("mongoose");
const modelName = "project_status";
const schema = new mongoose.Schema({
   code: {
      type: String,
      required: true
   },
   color: {
      type: String,
      required: true
   },
   translations: {
      es: {
         type: String,
         required: true
      },
      en: {
         type: String,
         required: true
      },
   }
});

module.exports = mongoose.model(modelName, schema);