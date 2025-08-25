const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", async (req, res) => {
  const todos = await Task.find();
  res.render("list", {
    todos,
    selectedPriority: "All",
    msg: req.query.msg || "",
  });
});

app.post("/add", async (req, res) => {
  const { taskText, priority } = req.body;
  if (!taskText.trim()) {
    return res.redirect("/?msg=" + encodeURIComponent("Task cannot be empty!"));
  }
  await Task.create({ title: taskText, priority });
  res.redirect("/?msg=" + encodeURIComponent("Task added successfully!"));
});

app.post("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect("/?msg=" + encodeURIComponent("Task deleted successfully!"));
});

app.post("/filter", async (req, res) => {
  const selectedPriority = req.body.filterPriority;
  let todos;
  if (selectedPriority === "All") {
    todos = await Task.find();
  } else {
    todos = await Task.find({ priority: selectedPriority });
  }
  res.render("list", { todos, selectedPriority, msg: "" });
});

app.get("/edit/:id", async (req, res) => {
  const todo = await Task.findById(req.params.id);
  if (!todo) {
    return res.redirect("/?msg=" + encodeURIComponent("Task not found!"));
  }
  res.render("edit", { todo, msg: req.query.msg || "" });
});

app.post("/edit/:id", async (req, res) => {
  const { taskText, priority } = req.body;
  await Task.findByIdAndUpdate(req.params.id, { title: taskText, priority });
  res.redirect("/?msg=" + encodeURIComponent("Task updated successfully!"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
