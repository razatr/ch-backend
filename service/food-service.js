import ApiError from '../exceptions/api-error.js';
import foodModel from '../models/food.js'

class FoodService {
  async getFood(foodId) {
    const food = await foodModel.getOne({foodId});
    if (!food) {
      throw ApiError.BadRequest(`Такого продукта с id ${foodId} не найдено`);
    }

    return food
  }
}

export default new FoodService();
