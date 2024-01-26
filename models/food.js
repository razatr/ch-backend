import DbModel from "./db-model.js";
import db from '../db.js'

class FoodModel extends DbModel{
  constructor(){
    super(db, 'food');
  }
}

export default new FoodModel();
