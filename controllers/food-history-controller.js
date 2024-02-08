import foodHistoryService from "../service/food-history-service.js";
import foodService from "../service/food-service.js";

class FoodHistoryController {
  async getHistoryForUser(req, res, next) {
    try {
      const history = await foodHistoryService.getHistoryForUser(req.user.userId);
      const fullHistory = [];
      for(let i = 0; i < history.length; i++) {
        const food = await foodService.getFood(history[i].foodId);
        delete history[i].foodId;
        fullHistory.push({...history[i], food})
      }
      return res.json(fullHistory);
    } catch(e) {
      next(e);
    }
  }
}

export default new FoodHistoryController;
