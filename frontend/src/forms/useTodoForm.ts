/* eslint-disable @typescript-eslint/no-explicit-any */
// forms/useTodoForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoInputSchema } from '../schemas/zodSchemas';

// Create a type for form values that matches what the form actually handles
type TodoFormValues = {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string | null; // Form handles strings, not Dates
};

export const useTodoForm = () => {
  return useForm<TodoFormValues>({
    resolver: zodResolver(todoInputSchema as any), // Use any to bypass type issues
    defaultValues: {
      title: '',
      description: '',
      priority: 'low',
      dueDate: null,
    },
  });
};