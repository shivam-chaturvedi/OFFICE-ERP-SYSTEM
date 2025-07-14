const Intern = require("../models/intern.model");

const createOrUpdateIntern = async (req, res) => {
  try {
    const { _id, name, email, position, startDate, endDate, phone } = req.body;

    let intern;

    if (_id) {
      // Update existing intern
      intern = await Intern.findById(_id);
      if (!intern) {
        return res
          .status(404)
          .json({ success: false, message: "Intern not found" });
      }
    } else {
      // Create new intern
      intern = new Intern();
    }

    intern.name = name;
    intern.email = email;
    intern.position = position;
    intern.startDate = startDate;
    intern.endDate = endDate;
    intern.phone = phone;

    await intern.save();

    res.status(201).json({
      success: true,
      message: _id
        ? "Intern updated successfully"
        : "Intern added successfully",
      data: intern,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json({ interns });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createOrUpdateIntern, getAllInterns };
