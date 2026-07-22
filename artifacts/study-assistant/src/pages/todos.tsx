import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Calendar, BookOpen, AlertCircle, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { 
  useListTodos, 
  useCreateTodo, 
  useUpdateTodo, 
  useDeleteTodo,
  getListTodosQueryKey,
  getGetTodoStatsQueryKey,
  TodoInputPriority
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Todos() {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<TodoInputPriority>("medium");
  const [subject, setSubject] = useState("");

  const { data: todos, isLoading } = useListTodos({
    query: { queryKey: getListTodosQueryKey() }
  });

  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    createMutation.mutate(
      { data: { title: newTask, priority, subject: subject || undefined } },
      {
        onSuccess: () => {
          setNewTask("");
          setSubject("");
          setPriority("medium");
          queryClient.invalidateQueries({ queryKey: getListTodosQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTodoStatsQueryKey() });
          toast.success("Task added");
        },
        onError: () => toast.error("Failed to add task"),
      }
    );
  };

  const handleToggle = (id: number, completed: boolean) => {
    updateMutation.mutate(
      { id, data: { completed } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTodosQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTodoStatsQueryKey() });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTodosQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetTodoStatsQueryKey() });
          toast.success("Task deleted");
        },
      }
    );
  };

  const priorityColors = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-accent/10 text-accent-foreground border-accent/20",
    low: "bg-secondary text-secondary-foreground border-secondary",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl tracking-tight text-foreground">To-Do List</h1>
        <p className="text-muted-foreground">Keep track of your academic responsibilities.</p>
      </header>

      {/* Add Task Form */}
      <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 text-base h-12 bg-background"
                disabled={createMutation.isPending}
              />
              <Button type="submit" className="h-12 px-8" disabled={createMutation.isPending || !newTask.trim()}>
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger className="w-[140px] h-9 bg-background">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Subject (e.g. Bio 101)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-[180px] h-9 bg-background"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3 mt-8">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="p-4 border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </Card>
          ))
        ) : todos?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-secondary/20">
            <CheckSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-serif text-xl mb-1">All caught up!</h3>
            <p className="text-muted-foreground">You don't have any pending tasks right now.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos?.sort((a, b) => {
              // Sort by completion, then priority
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              const pMap = { high: 0, medium: 1, low: 2 };
              return pMap[a.priority] - pMap[b.priority];
            }).map((todo) => (
              <Card 
                key={todo.id} 
                className={cn(
                  "group transition-all duration-200 border-border shadow-sm hover:shadow-md",
                  todo.completed && "opacity-60 bg-secondary/30"
                )}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <Checkbox 
                    checked={todo.completed}
                    onCheckedChange={(checked) => handleToggle(todo.id, checked as boolean)}
                    className="mt-1 h-5 w-5 transition-transform group-active:scale-90 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-lg font-medium leading-tight mb-1 transition-all",
                      todo.completed && "line-through text-muted-foreground"
                    )}>
                      {todo.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className={cn("text-xs uppercase tracking-wider font-semibold border", priorityColors[todo.priority])}>
                        {todo.priority}
                      </Badge>
                      {todo.subject && (
                        <Badge variant="secondary" className="text-xs bg-secondary/80 hover:bg-secondary">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {todo.subject}
                        </Badge>
                      )}
                      {todo.dueDate && (
                        <div className="flex items-center text-xs text-muted-foreground ml-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
