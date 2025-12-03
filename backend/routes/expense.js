import express from "express"
import Expense from "../controller/expense.js"

const expense_router = express.Router();

const ExpenseInstance = new Expense();

expense_router.get("/", ExpenseInstance.getExpenses);
expense_router.post("/add-expense", ExpenseInstance.insertExpense);
expense_router.get("/by-date", ExpenseInstance.getDailyExpenses);
expense_router.delete("/:id", ExpenseInstance.deleteExpense);
expense_router.put("/:id", ExpenseInstance.updateExpense);

export default expense_router;