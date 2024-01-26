import userModel from '../models/user-model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import mailService from '../service/mail-service.js';
import tokenServise from './token-servise.js';
import UserDto from '../dtos/user-dto.js'
import ApiError from '../exceptions/api-error.js';

class UserService {
  async registration(email, password) {
    const candidate = await userModel.getOne({email});
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с таким почтовым адресом ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await userModel.add({email, password: hashPassword, activationLink, registrationData: new Date()});
    // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({...userDto});
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = userModel.getOne({activationLink});
    if(!user){
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    await userModel.updade({isActivated: true}, {activationLink});
  }

  async login(email, password) {
    const user = await userModel.getOne({email});
    if (!user) {
      throw ApiError.BadRequest(`Пользователя с таким почтовым адресом ${email} не существует`);
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

  async update(newUserData, refreshToken) {
    const userData = await this.refresh(refreshToken);
    userModel.update(newUserData, {userId: userData.user.userId})
    const user = new UserDto(Object.assign(userData.user, newUserData));
    return user
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
    const user = await userModel.getOne({userId: userData.userId});
    const userDto = new UserDto(user);
    const tokens = tokenServise.generateTokens({...userDto});
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async getAllUsers() {
    const users = await userModel.getAll();
    return users;
  }
}

export default new UserService();
