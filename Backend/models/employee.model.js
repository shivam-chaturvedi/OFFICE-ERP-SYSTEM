const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  designation: {type:String,required:true},
  date_of_joining: Date,
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Employee', employeeSchema);
