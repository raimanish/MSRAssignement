const mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    name: String,
    available: Boolean
  }
)

module.exports = mongoose.model('Book', bookSchema);