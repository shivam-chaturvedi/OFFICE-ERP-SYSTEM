const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  name: String,
},{timestamps:true});

module.exports = mongoose.model('Department', departmentSchema);
