const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
 
  },
  customer_ids: {
    stripe: {
      type: String
    }
  },
}, {
  timestamps: true 
},{
  isGoogleAuth: Boolean
});

const User = mongoose.model('User', userSchema);

module.exports = User;