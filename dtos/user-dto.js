export default class UserDto {
  userId;
  email;
  name = '';
  surname = '';
  registration_data = new Date();
  last_active = new Date();
  birthday = new Date();
  weight = 0;
  height = 0;
  avatar = '';
  isActivated;

  constructor(model) {
    this.userId = model.userId;
    this.email = model.email;
    this.name = model.name;
    this.surname = model.surname;
    this.registration_data = model.registration_data;
    this.last_active = model.last_active;
    this.birthday = model.birthday;
    this.weight = Number(model.weight);
    this.height = model.height;
    this.avatar = model.avatar;
    this.isActivated = model.isActivated;
  }
}