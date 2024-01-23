import ApiError from "../exceptions/api-error.js";
import tokenServise from "../service/token-servise.js";


const authMiddleware = (req, res, next) => {
  try {
    const autorizatioHeader = req.headers.authorization;

    if(!autorizatioHeader) {
      return next(ApiError.UnautorizedError());
    }

    const accessToken = autorizatioHeader.split(' ')[1];
    if(!accessToken) {
      return next(ApiError.UnautorizedError());
    }

    const userData = tokenServise.validateAccessToken(accessToken);
    if(!userData) {
      return next(ApiError.UnautorizedError());
    }
    req.user = userData;
    next();
  } catch(e) {
    return next(ApiError.UnautorizedError());
  }
}

export default authMiddleware;
