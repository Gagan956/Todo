
// types/todo.ts
export interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
  completed?: boolean;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}