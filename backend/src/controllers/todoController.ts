import type{ Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo.js';

interface TodoRequest extends Request {
  body: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    completed?: boolean;
  }
}

// Create a new todo
export const createTodo = async (req: TodoRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.user!.userId
    });

    res.status(201).json({
      success: true,
      todo
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: 'Failed to create todo'
    });
  }
};

// Get todos 
export const getTodos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments({ userId: req.user!.userId });
    const completed = await Todo.countDocuments({ 
      userId: req.user!.userId, 
      completed: true 
    });

    res.json({
      success: true,
      todos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        total,
        completed,
        pending: total - completed
      }
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: 'Failed to retrieve todos'
    });
  }
};

// Update a todo
export const updateTodo = async (req: TodoRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user!.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.json({
      success: true,
      todo
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: 'Failed to update todo'
    });
  }
};


// Delete a todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ 
      _id: id, 
      userId: req.user!.userId 
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete todo'
    });
  }
};


// Toggle todo completion status
export const toggleComplete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOne({ _id: id, userId: req.user!.userId });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      success: true,
      todo
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: 'Failed to toggle todo completion status'
    });
  }
};