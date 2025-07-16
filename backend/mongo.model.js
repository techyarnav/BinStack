const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Paste', pasteSchema);
