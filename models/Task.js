const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
});

module.exports = mongoose.model("Task", taskSchema);
