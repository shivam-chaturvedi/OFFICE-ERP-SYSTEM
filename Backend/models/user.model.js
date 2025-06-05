const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  position: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joiningDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

