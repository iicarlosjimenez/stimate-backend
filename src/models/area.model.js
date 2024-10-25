const mongoose = require("mongoose");
const modelName = "areas";
const schema = new mongoose.Schema({
   area: {
      type: String,
      required: true
   },
   user_id: {
      type: mongoose.Types.ObjectId
   }
});

module.exports = mongoose.model(modelName, schema);