import ApiError from "../exceptions/api-error.js";
import tokenServise from "../service/token-servise.js";


const userMiddleware = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const userData = tokenServise.validateAccessToken(accessToken);

    if(userData.id !== req.body) {
      return next(ApiError.UnautorizedError());
    }
    req.user = userData;
    next();
  } catch(e) {
    return next(ApiError.UnautorizedError());
  }
}

export default userMiddleware;
