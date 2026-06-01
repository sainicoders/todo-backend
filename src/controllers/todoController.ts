import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Todo } from "../models/Todo";
import { HttpError } from "../utils/httpError";
import { createTodoSchema, updateTodoSchema } from "../validators/todoValidators";

function normalizeDueDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function serializeTodo(todo: any) {
  return {
    id: String(todo._id),
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    priority: todo.priority,
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString()
  };
}

export async function listTodos(req: Request, res: Response) {
  const todos = await Todo.find({ owner: req.user!.id }).sort({ createdAt: -1 });
  res.json({ todos: todos.map(serializeTodo) });
}

export async function createTodo(req: Request, res: Response) {
  const payload = createTodoSchema.parse(req.body);
  const todo = await Todo.create({
    ...payload,
    dueDate: normalizeDueDate(payload.dueDate),
    owner: req.user!.id
  });

  res.status(201).json({ todo: serializeTodo(todo) });
}

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new HttpError(400, "Invalid todo id");
  }

  const payload = updateTodoSchema.parse(req.body);
  const todo = await Todo.findOneAndUpdate(
    { _id: id, owner: req.user!.id },
    { ...payload, dueDate: normalizeDueDate(payload.dueDate) },
    { new: true, runValidators: true }
  );

  if (!todo) {
    throw new HttpError(404, "Todo not found");
  }

  res.json({ todo: serializeTodo(todo) });
}

export async function deleteTodo(req: Request, res: Response) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new HttpError(400, "Invalid todo id");
  }

  const todo = await Todo.findOneAndDelete({ _id: id, owner: req.user!.id });

  if (!todo) {
    throw new HttpError(404, "Todo not found");
  }

  res.status(204).send();
}
