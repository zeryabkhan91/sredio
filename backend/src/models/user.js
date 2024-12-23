import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  total_commits: Number,
  total_pulls: Number,
  total_issues: Number,
  repoId: Number,
  integrationId: {
    type: mongoose.Schema.ObjectId
  },
});

const User = mongoose.model("User", userSchema);

export default User;
