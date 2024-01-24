import DbError from "../exceptions/db-error.js";

class DbModel {
  #db;
  #table;

  constructor(db, table) {
    this.#db = db;
    this.#table = table;
  }

  #snakeToCamel(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map(snakeToCamel);
    }
  
    const camelObj = {};
  
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
        camelObj[camelKey] = this.#snakeToCamel(obj[key]);
      }
    }
  
    return camelObj;
  }

  #camelToSnake(string) {
    return string.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  }

  #parametersToSelectQuery(parameters, startPos = 1) {
    return Object.keys(parameters).map((param, i) => `${this.#camelToSnake(param)} = $${i + startPos}`).join(' ');
  }
  
  #parametersToInsertQuery(parameters) {
    return `(${Object.keys(parameters).map(this.#camelToSnake).join(' ,')}) values (${Object.keys(parameters).map((_, i) => `$${i + 1}`).join(' ,')})`;
  }

  async getAll() {
    const res = await this.#db.query(`SELECT * FROM ${this.#table}`);
    return res.rows ? res.rows.map(this.#snakeToCamel) : undefined;
  }

  async getOne(parameters) {
    console.log(`SELECT * FROM ${this.#table} where ${this.#parametersToSelectQuery(parameters)}`);
    console.log(Object.values(parameters));
    const res = await this.#db.query(`SELECT * FROM ${this.#table} where ${this.#parametersToSelectQuery(parameters)}`, 
    Object.values(parameters));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }

  async add(parameters) {
    const res = await this.#db.query(`INSERT INTO ${this.#table} ${this.#parametersToInsertQuery(parameters)} RETURNING *`, 
    Object.values(parameters));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }

  async delete(parameters) {
    const res = await this.#db.query(`DELETE FROM ${this.#table} where ${this.#parametersToSelectQuery(parameters)}`, 
    Object.values(parameters));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }

  async update(parameters, searchParaneters) {
    console.log('update');
    const res = await this.#db.query(`UPDATE ${this.#table} set ${this.#parametersToSelectQuery(parameters)} where ${this.#parametersToSelectQuery(searchParaneters, Object.keys(parameters).length + 1)}`, 
      Object.values({...parameters, ...searchParaneters}));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }
}

export default DbModel;
