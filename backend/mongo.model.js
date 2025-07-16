const pasteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  encrypted: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
