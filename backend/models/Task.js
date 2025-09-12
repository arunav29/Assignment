import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Task", taskSchema);
