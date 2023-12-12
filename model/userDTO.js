class UserDTO {
  constructor(id, email, userType, password) {
    this.id = id;
    this.email = email;
    this.userType = userType;
    this.password = password; // Include password field
  }
  static fromDatabase(userFromDB) {
    return new UserDTO(userFromDB.id, userFromDB.email, userFromDB.type, userFromDB.password)
  }
  
}

module.exports = UserDTO;
