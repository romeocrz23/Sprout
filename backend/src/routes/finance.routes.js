const express = require('express');
const FinanceController = require('../controllers/finance.controller');
const router = express.Router();

/**
 * @route GET api/finances/budgets/:id
 * @desc Get existing budgets by ID
 * @access Private
 */
router.get("/finances/budgets/:id", FinanceController.getBudget);

/**
 * @route POST api/finances/budgets
 * @desc Create new budget
 * @access Private
 */
router.post("/finances/budgets", FinanceController.createBudget);

/**
 * @route DELETE api/finances/budgets/:id
 * @desc Delete existing budgets by ID
 * @access Private
 */
router.delete("/finances/budget/:id", FinanceController.deleteBudget);

/**
 * @route UPDATE api/finances/budgets/:id
 * @desc Edit existing budgets by ID
 * @access Private
 */
router.put("/finances/budget/:id", FinanceController.editBudget);

/**
 * @route GET api/finances/expenses/:id
 * @desc  Get existing expenses by ID
 * @access Private
 */
router.get("/finances/expenses/:id", FinanceController.getExpenseItem);

/**
 * @route POST api/finances/expenses
 * @desc Create new expense item
 * @access Private
 */
router.post("/finances/expenses", FinanceController.createExpenseItem);

/**
 * @route DELETE api/finances/expenses/:id
 * @desc Delete existing expense item by ID
 * @access Private
 */
router.delete("/finances/expenses/:id", FinanceController.deleteExpenseItem);

/**
 * @route UPDATE api/finances/expenses/:id
 * @desc Edit existing expense item by ID
 * @access Private
 */
router.put("/finances/expenses/:id", FinanceController.editExpenseItem);

module.exports = router;