import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(140),
  description: z.string().trim().max(500).optional().default(""),
  completed: z.boolean().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().datetime().optional().or(z.literal(""))
});

export const updateTodoSchema = createTodoSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one todo field must be provided"
);
