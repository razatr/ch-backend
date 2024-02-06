import { Router } from "express";
import userController from "../controllers/user-controller.js";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth-middleware.js";
import foodHistoryController from "../controllers/food-history-controller.js";

const router = new Router();

router.post('/registration', body('email').isEmail(), body('password').isLength({min: 5, max: 32}), userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/update', userController.update);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/history', authMiddleware, foodHistoryController.getHistoryForUser);

export default router;
