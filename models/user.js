const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: { type: String, required: true, minlength: 2 },
    last: { type: String, minlength: 2 },
  },
  username: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true, minlength: 3 },
  member: { type: Boolean, required: true },
  admin: { type: Boolean, required: true },
});

UserSchema.virtual("fullname").get(function () {
  let lastName = this.name.last !== undefined ? this.name.last : "";
  return `${this.name.first} ${lastName}`;
});

module.exports = mongoose.model("User", UserSchema);
