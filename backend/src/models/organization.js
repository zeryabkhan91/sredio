import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  login: String,
  id: { type: Number, unique: true },
  node_id: String,
  url: String,
  repos_url: String,
  events_url: String,
  hooks_url: String,
  issues_url: String,
  members_url: String,
  public_members_url: String,
  avatar_url: String,
  description: String,
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
