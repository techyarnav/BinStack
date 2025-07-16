const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Missing');
console.log('CROW_SERVICE_URL:', process.env.CROW_SERVICE_URL);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const app = express();

const pastesDir = path.join(__dirname, '..', 'pastes');
if (!fs.existsSync(pastesDir)) fs.mkdirSync(pastesDir);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

mongoose.connect(process.env.MONGO_URI)  .then(() => console.log('MongoDB connected.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/', require('./paste.routes'));

const PORT = process.env.PORT || 3001;  
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
