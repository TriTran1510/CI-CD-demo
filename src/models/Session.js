export class Session {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.email = data.email;
    this.username = data.username;
    this.accessToken = data.accessToken;
    this.loginAt = data.loginAt || new Date();
    this.logoutAt = data.logoutAt || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }
}
