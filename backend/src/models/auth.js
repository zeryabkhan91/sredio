import mongoose from "mongoose";

const integrationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accessToken: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Integration = mongoose.model("Integration", integrationSchema);
export default Integration;
