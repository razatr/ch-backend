import UserModel from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from '../service/mail-service.js';
import tokenServise from './token-servise.js';
import UserDto from '../dtos/user-dto.js'
import ApiError from '../exceptions/api-error.js';
import db from '../db.js'

class UserService {
  async registration(email, password) {
    const candidate = await db.query(`SELECT * FROM users where email = $1`, [email]).rows[0];
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с таким почтовым адресом ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await UserModel.create({email, password: hashPassword, activationLink});
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({...userDto});
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink});
    if(!user){
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({email});
    if (!user) {
      throw ApiError.BadRequest(`Пользователья с таким почтовым адресом ${email} не существует`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }

    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({...userDto});
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async logout(refreshToken) {
    const token = await tokenServise.deleteToken(refreshToken);
    return token
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnautorizedError();
    }
    const userData = tokenServise.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenServise.findToken(refreshToken);
    if(!userData || !tokenFromDb) {
      throw ApiError.UnautorizedError()
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({...userDto});
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async getAllUsers() {
    const users = await db.query(`SELECT * FROM users`).rows;
    return users;
  }
}

export default new UserService();
