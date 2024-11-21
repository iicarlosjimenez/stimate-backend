const mongoose = require("mongoose");

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
    type: String
  },
  customer_ids: {
    stripe: {
      type: String
    }
  },
  isGoogleAuth: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  state_subscription: {
    type: Boolean,
    default: true,
  },
  start_subscription: {
    type: Date,
    default: null
  },
  end_subscription: {
    type: Date,
    default: null
  }
},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

userSchema.virtual('isActiveSubscription').get(function () {
  const now = new Date();
  return this.start_subscription && this.end_subscription
    ? now >= this.start_subscription && now <= this.end_subscription
    : false;
});

const User = mongoose.model("User", userSchema);

module.exports = User;