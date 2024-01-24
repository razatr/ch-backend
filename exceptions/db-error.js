class DbError extends Error {
  table;
  params;

  constructor(tbale, message, params) {
    super(message);
    this.table = table;
    this.params = params;
  }

  static NotFound(table, params = {}) {
    return new DbError(table, 'Не найдена(ы) запись(и)', params);
  }
}

export default DbError
