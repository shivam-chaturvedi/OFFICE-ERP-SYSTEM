const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "hr", "employee", "project_manager"],
      default: "employee",
    },
    position: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },

    // Emergency Contact
    emergency_contact: {
      name: String,
      relation: String,
      contact_number: String,
    },

    date_of_birth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
