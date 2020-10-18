const { v4: uuidv4 } = require("uuid");

class User {
  constructor(name, hashed_password, email) {
    this.id = uuidv4();
    this.name = name;
    this.hashed_password = hashed_password;
    this.created = Date.now();
    this.updated = this.created;
    this.email = email;
    this.active = 1;
  }

  static from(json) {
    return Object.assign(new User(), json);
  }
}

module.exports = User;
