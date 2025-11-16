import type { Request, Response } from 'express';
interface TodoRequest extends Request {
    body: {
        title: string;
        description?: string;
        priority: 'low' | 'medium' | 'high';
        dueDate?: Date;
        completed?: boolean;
    };
}
export declare const createTodo: (req: TodoRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTodos: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTodo: (req: TodoRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTodo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleComplete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
