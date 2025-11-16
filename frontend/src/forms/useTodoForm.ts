// forms/useTodoForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoInputSchema, type TodoInput } from '../schemas/zodSchemas';

export const useTodoForm = () => {
  return useForm<TodoInput>({
    resolver: zodResolver(todoInputSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'low',
      dueDate: null,
    },
  });
};