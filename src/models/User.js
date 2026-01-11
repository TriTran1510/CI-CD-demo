export class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.salt = data.salt;
    this.username = data.username;
    this.createdAt = data.createdAt || new Date();
  }
}