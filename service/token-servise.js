import jwt from 'jsonwebtoken'
import tokenModel from '../models/token-model.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {accessToken, refreshToken}
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch(e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch(e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.getOne({userId});
    if(tokenData) {
      return await tokenModel.update({refreshToken}, {userId});
    }
    const token = await tokenModel.add({userId, refreshToken});
    return token
  }

  async deleteToken(refreshToken) {
    const tokenData = await tokenModel.delete({refreshToken});
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.getOne({refreshToken});
    return tokenData;
  }
}

export default new TokenService();
