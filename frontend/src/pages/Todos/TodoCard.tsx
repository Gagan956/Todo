import React from 'react';
import { Edit2, Trash2, Calendar, Flag } from 'lucide-react';

interface Todo {
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const priorityColors = {
  low: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-red-600 bg-red-100',
};

const priorityIcons = {
  low: <Flag size={14} className="text-green-600" />,
  medium: <Flag size={14} className="text-yellow-600" />,
  high: <Flag size={14} className="text-red-600" />,
};

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo._id)}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className="mt-1 text-sm text-gray-600">
                {todo.description}
              </p>
            )}
            
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                {priorityIcons[todo.priority]}
                <span className="capitalize">{todo.priority}</span>
              </div>
              
              {todo.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{formatDate(todo.dueDate)}</span>
                </div>
              )}
              
              <span>{formatDate(todo.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(todo)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          
          <button
            onClick={() => onDelete(todo._id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};