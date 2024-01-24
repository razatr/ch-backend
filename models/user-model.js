import DbModel from "./db-model.js";
import db from '../db.js'

class UserModel extends DbModel{
  constructor(){
    super(db, 'users');
  }
}

export default new UserModel();
