import { Router } from "express";
import { createTodo, deleteTodo, listTodos, updateTodo } from "../controllers/todoController";
import { requireAuth } from "../middleware/auth";

export const todoRouter = Router();

todoRouter.use(requireAuth);
todoRouter.get("/", listTodos);
todoRouter.post("/", createTodo);
todoRouter.patch("/:id", updateTodo);
todoRouter.delete("/:id", deleteTodo);
