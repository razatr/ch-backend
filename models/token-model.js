import DbModel from "./db-model.js";
import db from '../db.js'

class TokenModel extends DbModel {
  constructor() {
    super(db, 'tokens');
  }
}

export default new TokenModel();
