import { Router, type IRouter } from "express";
import { eq, count, and } from "drizzle-orm";
import { db, todosTable } from "@workspace/db";
import {
  CreateTodoBody,
  CreateTodoResponse,
  UpdateTodoParams,
  UpdateTodoBody,
  UpdateTodoResponse,
  DeleteTodoParams,
  ListTodosResponse,
  GetTodoStatsResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/todos/stats", async (req, res): Promise<void> => {
  const todos = await db.select().from(todosTable);
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter(
    (t) => t.priority === "high" && !t.completed,
  ).length;
  res.json(GetTodoStatsResponse.parse({ total, completed, pending, highPriority }));
});

router.get("/todos", async (_req, res): Promise<void> => {
  const todos = await db
    .select()
    .from(todosTable)
    .orderBy(todosTable.createdAt);
  res.json(ListTodosResponse.parse(todos));
});

router.post("/todos", async (req, res): Promise<void> => {
  const parsed = CreateTodoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { title, priority = "medium", subject, dueDate } = parsed.data;
  const [todo] = await db
    .insert(todosTable)
    .values({ title, priority, subject, dueDate })
    .returning();
  res.status(201).json(CreateTodoResponse.parse(todo));
});

router.patch("/todos/:id", async (req, res): Promise<void> => {
  const params = UpdateTodoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTodoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [todo] = await db
    .update(todosTable)
    .set(parsed.data)
    .where(eq(todosTable.id, id))
    .returning();
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.json(UpdateTodoResponse.parse(todo));
});

router.delete("/todos/:id", async (req, res): Promise<void> => {
  const params = DeleteTodoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [todo] = await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();
  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
