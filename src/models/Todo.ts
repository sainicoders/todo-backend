import { model, Schema, Types, type InferSchemaType } from "mongoose";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    dueDate: {
      type: Date
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

export type TodoDocument = InferSchemaType<typeof todoSchema>;

export const Todo = model<TodoDocument>("Todo", todoSchema);
