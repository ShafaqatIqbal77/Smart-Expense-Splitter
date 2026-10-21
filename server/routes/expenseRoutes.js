// =====================================================================
// routes/expenseRoutes.js
// =====================================================================

import express from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} from '../controllers/expenseController.js';

const router = express.Router();

// GET  /api/expenses/summary → Balance summary (yeh pehle hona chahiye /:id se)
// Agar yeh neeche hota toh Express "summary" ko ID samjhta!
router.get('/summary', getExpenseSummary);

// GET  /api/expenses    → Sab expenses (with optional ?group= filter)
// POST /api/expenses    → Naya expense add karo
router.route('/')
  .get(getAllExpenses)
  .post(createExpense);

// GET    /api/expenses/:id → Ek expense
// PUT    /api/expenses/:id → Update karo
// DELETE /api/expenses/:id → Delete karo
router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
