import express from 'express';
import { getBudgets, setBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.post('/', setBudget);
router.get('/:userId', getBudgets);

export default router;
