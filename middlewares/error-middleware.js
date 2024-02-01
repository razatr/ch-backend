import pg from "pg";
import ApiError from "../exceptions/api-error.js";

const errorMiddleware = (err, req, res, next) => {
  console.log(err);
  const { DatabaseError } = pg;
  if(err instanceof ApiError){
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }

  if(err instanceof DatabaseError){
    return res.status(500).json({message: 'Ошибка базы данных'});
  }

  return res.status(500).json({message: 'Непредвиденная ошибка на сервере'});
}

export default errorMiddleware;
