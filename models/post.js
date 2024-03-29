const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minlength: 3 },
  text: { type: String, required: true, minlength: 3 },
  timestamp: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

// See specific post
PostSchema.virtual("url").get(function () {
    // Not decided yet.
});

PostSchema.virtual("format_time").get(function () {
  return this.timestamp.toLocaleDateString(undefined,{ year: 'numeric', month: 'long', day: 'numeric' });
})

module.exports = mongoose.model("Post", PostSchema);
