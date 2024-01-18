import ExpenseRepository from "./expense.repository.js";
import ExpenseModel from './expense.model.js';

export default class ExpenseController {
  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  // Create new expense
  add = async (req, res) => {
    try {
      const {title, amount, date, isRecurring,tags } = req.body;
      const numericAmount = parseFloat(amount);
      const recurring = Boolean(isRecurring);
      const newExpense = new ExpenseModel(title,numericAmount,date,recurring,tags);
      console.log("expenses",newExpense);
      const createdExpense = await this.expenseRepository.addExpense(newExpense);
      res.status(201).send(createdExpense);
    } catch (error) {
      
    }
  };

  // Get a specific expense
  getOne = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log("Id", id)
      const oneExpense = await this.expenseRepository.getOne(id);
      if(!oneExpense) res.status(404).send("Expenses data not found");
      else res.status(200).send(oneExpense);
    } catch (error) {
      
    }
  };

  // Get all expenses
  getAll = async (req, res) => {
    try {
      const allExpense = await this.expenseRepository.getAllExpenses();
      res.status(200).send(allExpense);
    } catch (error) {
      
    }
  };

  // Add a tag to an expense
  addTag = async (req, res) => {
    try {
      const expenseId = req.params.id;
    const tag = req.body.tag;
    await this.expenseRepository.addTagToExpense(expenseId,tag);
    res.status(200).send("Tag is added")
    } catch (error) {
      
    }
  };

  // Filter expenses based on given criteria
  filter = async (req, res) => {
    try {
      const criteria = req.query;
      console.log("critetia con", criteria);
    const filteredExpenses = await this.expenseRepository.filterExpenses(criteria);
    res.status(200).send(filteredExpenses);
    } catch (error) {
      
    }
  };
}
