const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  created_at: Date,
  updated_at: Date
})
PostSchema.pre('save', function (next) {
  let now = new Date()
  this.updated_at = now
  if (!this.created_at) {
    this.created_at = now
  }
  next()
})
const Post = mongoose.model('Post', PostSchema)

module.exports = Post
