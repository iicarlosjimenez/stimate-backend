const mongoose = require("mongoose");
const modelName = "types_recurring";
const schema = new mongoose.Schema({
   code: {
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

export default mongoose.model(modelName, schema);