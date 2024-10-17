import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  total_commits: Number,
  total_pulls: Number,
  total_issues: Number,
});

const User = mongoose.model("User", userSchema);

export default User;
