const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  password: {
    type: String,
  },
  mobile: {
    type: String,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
