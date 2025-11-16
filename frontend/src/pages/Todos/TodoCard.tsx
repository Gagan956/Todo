import React from 'react';
import { Edit2, Trash2, Calendar, Flag } from 'lucide-react';
import type { Todo } from '../../types/todo';

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
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return '';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const formatCreatedAt = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return '';
      
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting created at date:', error);
      return '';
    }
  };

  const handleToggle = () => {
    onToggle(todo._id);
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  const handleDelete = () => {
    onDelete(todo._id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed || false}
            onChange={handleToggle}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
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
              
              <span className="text-gray-400">
                Created: {formatCreatedAt(todo.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
            title="Edit todo"
          >
            <Edit2 size={16} />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete todo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};