const mongoose = require("mongoose");
const modelName = "areas";
const schema = new mongoose.Schema({
   name: { // Cambia 'area' por 'name'
      type: String,
      required: true
   },
   user_id: {
      type: mongoose.Types.ObjectId
   }
});

module.exports = mongoose.model(modelName, schema);