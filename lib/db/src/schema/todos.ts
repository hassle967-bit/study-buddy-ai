import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const todosTable = pgTable("todos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  priority: text("priority").notNull().default("medium"),
  subject: text("subject"),
  dueDate: text("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTodoSchema = createInsertSchema(todosTable).omit({ id: true, createdAt: true });
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Todo = typeof todosTable.$inferSelect;
