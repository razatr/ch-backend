import DbModel from "./db-model.js";
import db from '../db.js'

class VitaminsModel extends DbModel{
  constructor(){
    super(db, 'vitamins');
  }
}

export default new VitaminsModel();
