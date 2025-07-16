const mongoose = require('mongoose');
const shareSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  pasteId: { type: String, required: true },
  content: { type: String, required: true },
  encrypted: { type: Boolean, default: false }, 
  expiresAt: { type: Date, required: true },
  accessCount: { type: Number, default: 0 },
  maxAccess: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});
