import { getDB } from "../../config/mongodb.js";
import {ObjectId} from "mongodb";

class ExpenseRepository {
  constructor() {
    this.collectionName = "expenses"; // name of the collection in mongodb
  }

  // Create a new expense
  async addExpense(expense) {
    try {
      //console.log("Repo expense",expense);
      const db  = getDB();
      const collection = db.collection(this.collectionName)
      await collection.insertOne(expense);
      return expense;
    } catch (error) {
      console.log(error); 
      
    }
  }

  // Get one expnese by its ID
  async getOne(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName)
      console.log("repo Id", id );
      const g = new ObjectId(id)
      console.log("ObjectId ",g);
       return await collection.findOne({_id: new ObjectId(id)});
    } catch (error) {
      
    }
  }

  // Get all expenses
  async getAllExpenses() {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName)
      const allExpenses = await collection.find().toArray();
      return allExpenses;
    } catch (error) {
      
    }
  }

  // Add tag to an expense
  async addTagToExpense(id, tag) {
    try {
      const db = getDB();
      const collection = db.collection(this.collectionName);
      const expense = await collection.findOne({ _id: new ObjectId(id) })
      console.log("Tag",tag);
      await collection.updateOne({ _id: new ObjectId(id) },{ $push: { tags: tag } });
      const updatedExpense = await collection.findOne({ _id: new ObjectId(id) });
      return updatedExpense;
    } catch (error) {
      
    }

  }

  // Filter expenses based on date, amount, and isRecurring field
  async filterExpenses(criteria) {
  try {
    console.log("ctiteria",criteria)
    const db = getDB();
      const collection = db.collection(this.collectionName);
      // Construct the filter object based on the provided criteria
    let filter = {};
    if (criteria.minAmount) {
      filter.amount = { $gte: parseFloat(criteria.minAmount) };
    }

    if (criteria.maxAmount) {
      filter.amount = {...filter.amount, $lte: parseFloat(criteria.maxAmount)}
    }
    console.log("filter beofre if",filter);

    // / Check if criteria.isRecurring exists before applying conditions
    if ('isRecurring' in criteria) {
      if (criteria.isRecurring.toLowerCase() === 'false') {
        filter.isRecurring = false;
      } else if (criteria.isRecurring.toLowerCase() === 'true') {
        filter.isRecurring = true;
      }
    }
    console.log("filter after all function",filter);
    
    
    // Reset the filter object back to an empty state
    // filter = {};

    const filteredExpenses = await collection.find(filter).toArray();

    return filteredExpenses;
      
    
  } catch (error ) {
    
  }

  }
}

export default ExpenseRepository;
