import ApiError from '../exceptions/api-error.js';
import foodHistoryModel from '../models/food-history.js'

class FoodHistoryService {
  async getHistoryForUser(userId) {
    const userHistory = await foodHistoryModel.getAll({userId});
    if (userHistory === undefined) {
      throw ApiError.BadRequest(`Ошибка в получении истории`);
    }
    return userHistory
  }
}

export default new FoodHistoryService();
