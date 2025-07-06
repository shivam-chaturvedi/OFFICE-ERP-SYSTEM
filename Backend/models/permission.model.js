const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  permissions: [String],
});

module.exports = mongoose.model("Permission", permissionSchema);
