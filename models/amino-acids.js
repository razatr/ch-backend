import DbModel from "./db-model.js";
import db from '../db.js'

class AminoAcidsModel extends DbModel{
  constructor(){
    super(db, 'amino_acids');
  }
}

export default new AminoAcidsModel();
