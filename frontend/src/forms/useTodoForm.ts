import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, type TodoInput } from '../schemas/zodSchemas';

export const useTodoForm = (defaultValues?: Partial<TodoInput>) => {
  return useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'low',
      dueDate: undefined,
      ...defaultValues,
    },
  });
};