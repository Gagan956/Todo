/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  CheckCircle,
  Clock,
  ListTodo,
} from "lucide-react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useToggleTodo,
} from "../../api/hooks";
import { useTodoForm } from "../../forms/useTodoForm";
import { TodoCard } from "./TodoCard";
import type { Todo } from '../../types/todo';
import type { TodoInput } from "../../schemas/zodSchemas";

export const TodosPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const { data: todosData, isLoading } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const toggleTodoMutation = useToggleTodo();

  const createForm = useTodoForm();
  const editForm = useTodoForm();

  const todos = todosData?.todos || [];
  const stats = todosData?.stats || {
    total: 0,
    completed: 0,
    pending: 0,
  };

  // Create Todo - No need to transform date, Zod schema handles it
  const onSubmitCreate = async (data: TodoInput) => {
    try {      
      await createTodoMutation.mutateAsync(data);
      createForm.reset();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Create todo failed:", err);
    }
  };

  // Edit Todo - No need to transform date, Zod schema handles it
  const onSubmitEdit = async (data: TodoInput) => {
    if (!editingTodo) return;
    try {
      await updateTodoMutation.mutateAsync({
        id: editingTodo._id,
        ...data,
      });

      editForm.reset();
      setEditingTodo(null);
    } catch (err) {
      console.error("Update todo failed:", err);
    }
  };

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo);
    
    // Convert dueDate to string in YYYY-MM-DD format for date input
    let formattedDueDate: string | null = null;
    if (todo.dueDate) {
      formattedDueDate = formatDateForInput(todo.dueDate);
    }

   editForm.reset({
  title: todo.title,
  description: todo.description || '',
  priority: todo.priority,
  dueDate: formattedDueDate as Date | null, // This would not work if you have a string, so you need to convert it to Date or handle it differently.
});

  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      await deleteTodoMutation.mutateAsync(id);
    } catch (err) {
      console.error("Delete todo failed:", err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodoMutation.mutateAsync(id);
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <p className="text-gray-600">You have {stats.pending} active tasks</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Todos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {todos.map((todo: Todo) => (
          <TodoCard
            key={todo._id}
            todo={todo}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}

        {todos.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)} title="Add New Task">
          <TodoForm
            form={createForm}
            isLoading={createTodoMutation.isPending}
            onSubmit={onSubmitCreate}
            submitText="Create Task"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <Modal onClose={() => setEditingTodo(null)} title="Edit Task">
          <TodoForm
            form={editForm}
            isLoading={updateTodoMutation.isPending}
            onSubmit={onSubmitEdit}
            submitText="Update Task"
          />
        </Modal>
      )}
    </div>
  );
};

/* ---------------- Reusable Components ---------------- */

const StatsGrid = ({ stats }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatCard icon={ListTodo} color="blue" label="Total Tasks" value={stats.total} />
    <StatCard icon={CheckCircle} color="green" label="Completed" value={stats.completed} />
    <StatCard icon={Clock} color="yellow" label="Pending" value={stats.pending} />
    <StatCard
      icon={TrendingUp}
      color="purple"
      label="Completion Rate"
      value={`${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`}
    />
  </div>
);

const StatCard = ({ icon: Icon, color, label, value }: any) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border">
    <div className="flex items-center space-x-3">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-2 text-center py-12">
    <ListTodo className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
  </div>
);

const Modal = ({ onClose, title, children }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 transition-opacity">
    <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {children}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const TodoForm = ({ form, onSubmit, isLoading, submitText }: any) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    {/* Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Title *</label>
      <input
        type="text"
        {...form.register("title")}
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter task title"
      />
      {form.formState.errors.title && (
        <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
      )}
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        {...form.register("description")}
        rows={3}
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter task description (optional)"
      />
      {form.formState.errors.description && (
        <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
      )}
    </div>

    {/* Priority + Date */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          {...form.register("priority")}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {form.formState.errors.priority && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.priority.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          {...form.register("dueDate")}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          min={new Date().toISOString().split('T')[0]} // Optional: prevent past dates
        />
        {form.formState.errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{form.formState.errors.dueDate.message}</p>
        )}
      </div>
    </div>

    {/* Submit */}
    <button
      type="submit"
      disabled={isLoading}
      className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
    >
      {isLoading ? "Please wait..." : submitText}
    </button>
  </form>
);

/* ---------- Helper ---------- */
function formatDateForInput(date: string | Date): string {
  const d = new Date(date);
  // Get local date in YYYY-MM-DD format for date input
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}