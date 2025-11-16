import express from 'express';
import {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleComplete
} from '../controllers/todoController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id/toggle', toggleComplete);

export default router;