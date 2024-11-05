import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  name: string;
  status: "pending" | "completed";
}

const taskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ITask>("Task", taskSchema);
