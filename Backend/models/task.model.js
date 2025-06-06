const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  due_date: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'] }
});

module.exports = mongoose.model('Task', taskSchema);
