const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role_in_project: String
});

module.exports = mongoose.model('ProjectAssignment', assignmentSchema);
