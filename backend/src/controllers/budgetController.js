import Budget from '../models/Budget.js';

// @desc    Get all budgets for a user
// @route   GET /api/budgets/:userId
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.params.userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update a budget
// @route   POST /api/budgets
export const setBudget = async (req, res) => {
  try {
    const { user, category, limit, period } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user, category },
      { limit, period },
      { new: true, upsert: true }
    );

    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
