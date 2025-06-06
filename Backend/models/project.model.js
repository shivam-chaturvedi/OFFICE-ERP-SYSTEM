const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  name: String,
  description: String,
  start_date: Date,
  end_date: Date,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', projectSchema);
