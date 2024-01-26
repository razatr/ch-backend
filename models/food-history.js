import DbModel from "./db-model.js";
import db from '../db.js'

class FoodHistoryModel extends DbModel{
  constructor(){
    super(db, 'food_history');
  }
}

export default new FoodHistoryModel();
