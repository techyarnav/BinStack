const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  pasteId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  accessCount: { type: Number, default: 0 },
  maxAccess: { type: Number, default: 10 } 
});

shareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Share', shareSchema);
