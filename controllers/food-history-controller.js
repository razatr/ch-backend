import foodHistoryService from "../service/food-history-service.js";

class FoodHistoryController {
  async getHistoryForUser(req, res, next) {
    try {
      history = await foodHistoryService.getHistoryForUser(req.user.userId);
      return history;
    } catch(e) {
      next(e);
    }
  }
}

export default new FoodHistoryController;
