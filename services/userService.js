const userRepository = require('../Repository/userRepository');
const UserDTO = require('../model/userDTO');

// ... existing code ...

function createUser(userData, callback) {
  userRepository.createUser(userData, callback);
}

function findUserByEmail(email, callback) {
  userRepository.findUserByEmail(email, (err, userFromDB) => {
    if (err) {
      callback(err, null);
    } else {
      if (userFromDB) {
        const userDTO = UserDTO.fromDatabase(userFromDB);
        callback(null, userDTO);
      } else {
        callback(null, null);
      }
    }
  });
}

function findUserById(userId, callback) {
  userRepository.findUserById(userId, (err, userFromDB) => {
    if (err) {
      callback(err, null);
    } else {
      if (userFromDB) {
        const userDTO = UserDTO.fromDatabase(userFromDB);
        callback(null, userDTO);
      } else {
        callback(null, null);
      }
    }
  });
  
}
function updateUserTypeByEmail(email, newType, callback) {
  userRepository.updateUserType(email, newType, callback);
}





function getAllManagers(callback) {
  userRepository.getAllManagers(callback);
}

function getAllUsers(callback) {
  userRepository.getAllUsers(callback);
}



function createTask(taskData, description, callback) {
  userRepository.createTask(taskData, description ,callback);
}


function checkUserAssociated(taskData, description, callback) {
  userRepository.checkUserAssociated(taskData, description ,callback);
}

function getAllUsers2(userEmail ,callback) {
  userRepository.getAllUsersForManager2(userEmail, callback);
}


function updateTask(useremail, description , userEmail ,task, callback) {
  userRepository.updateTask(useremail, description ,userEmail ,task, callback);
}




function getalltask(userEmail ,callback) {
  userRepository.getalltask(userEmail, callback);
}


function updateTaskstatus(userEmail, task, status, callback) {
  userRepository.updateTaskStatus(userEmail, task, status, callback);
}


module.exports = { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  updateUserTypeByEmail, 
  getAllManagers,
  getAllUsers, 
  createTask, 
  getAllUsers2 ,
  updateTask,
  getalltask,
  updateTaskstatus,
  checkUserAssociated
 
  };
