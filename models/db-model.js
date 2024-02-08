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
      return obj.map(this.#snakeToCamel);
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
  
  #parametersToUpdateQuery(parameters, startPos = 1) {
    return Object.keys(parameters).map((param, i) => `${this.#camelToSnake(param)} = $${i + startPos}`).join(', ');
  }

  #parametersToInsertQuery(parameters) {
    return `(${Object.keys(parameters).map(this.#camelToSnake).join(' ,')}) values (${Object.keys(parameters).map((_, i) => `$${i + 1}`).join(' ,')})`;
  }

  async #safeQuery(query, parameters) {
    try {
      const res = await this.#db.query(query, parameters);
      return res;
    } catch(e) {
      e.internalQuery = query;
      e.table = this.#table;
      throw e
    }
  }

  async getAll(parameters = {}) {
    const query = `SELECT * FROM ${this.#table}${Object.keys(parameters) !== 0 ? ` where ${this.#parametersToSelectQuery(parameters)}` : ''}`;
    const res = await this.#safeQuery(query, Object.values(parameters));
    return res.rows ? res.rows.map((obj) => this.#snakeToCamel(obj)) : undefined;
  }

  async getOne(parameters) {
    const query = `SELECT * FROM ${this.#table} where ${this.#parametersToSelectQuery(parameters)}`;
    const res = await this.#safeQuery(query, Object.values(parameters));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }

  async add(parameters) {
    const query = `INSERT INTO ${this.#table} ${this.#parametersToInsertQuery(parameters)} RETURNING *`;
    const res = await this.#safeQuery(query, Object.values(parameters));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }

  async delete(parameters) {
    const query = `DELETE FROM ${this.#table} where ${this.#parametersToSelectQuery(parameters)}`;
    const res = await this.#safeQuery(query, Object.values(parameters));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }

  async update(parameters, searchParameters) {
    const query = `UPDATE ${this.#table} set ${this.#parametersToUpdateQuery(parameters)} where ${this.#parametersToSelectQuery(searchParameters, Object.keys(parameters).length + 1)}`;
    const res = await this.#safeQuery(query, Object.values({...parameters, ...searchParameters}));
    return res.rows ? this.#snakeToCamel(res.rows[0]) : undefined;
  }
}

export default DbModel;
