import express from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Create task
router.post("/", auth, async (req, res) => {
  const task = new Task({ text: req.body.text, userId: req.userId });
  await task.save();
  res.json(task);
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: "Task deleted" });
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const { text } = req.body;
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { text },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Task not found" });
  res.json(updated);
});

export default router;
