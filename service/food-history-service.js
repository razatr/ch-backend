import ApiError from '../exceptions/api-error.js';
import foodHistoryModel from '../models/food-history.js'

class FoodHistoryService {
  async getHistoryForUser(userId) {
    const userHistory = await foodHistoryModel.getAll({userId});
    if (userHistory) {
      throw ApiError.BadRequest(`Для пользователя c id ${userId} не найдено ни одной записи`);
    }

    return userHistory
  }
}

export default new FoodHistoryService();
