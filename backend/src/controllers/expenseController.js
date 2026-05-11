import Expense from '../models/Expense.js';

// @desc    Fetch all expenses
// @route   GET /api/expenses
// @access  Public (Should be Private with Auth)
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public (Should be Private with Auth)
export const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date, user } = req.body;

    const expense = new Expense({
      amount,
      category,
      description,
      date,
      user, // In a real app, this would come from req.user
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public (Should be Private with Auth)
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      await expense.deleteOne();
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
