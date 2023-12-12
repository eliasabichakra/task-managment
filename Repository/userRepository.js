const mysql = require('mysql');
const UserDTO = require('../model/userDTO');
const userController = require('../controllers/userController')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1',
  database: 'userdb'
});

connection.connect();
//sign up 
function createUser(userData, callback) {
  connection.query('INSERT INTO usertable SET ?', userData, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}
// sign in 
function findUserByEmail(email, callback) {
  connection.query('SELECT * FROM usertable WHERE email = ?', email, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      let foundUserEmail = null; // Initialize a variable to store the email

      if (rows.length > 0) {
        foundUserEmail = rows[0].email; // Store the email if user is found
        callback(null, rows[0]);
      } else {
        callback(null, null);
      }

      // You can use foundUserEmail here if needed for further processing
      console.log('Found user email:', foundUserEmail);
    }
  });

}





function findUserById(userId, callback) {
  connection.query('SELECT * FROM usertable WHERE id = ?', userId, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      if (rows.length > 0) {
        callback(null, rows[0]);
      } else {
        callback(null, null);
      }
    }
  });
}
function updateUserType(email, newType, callback) {
  // Perform an update query in your database to change the user's type
  const updateQuery = 'UPDATE usertable SET type = ? WHERE email = ?';
  connection.query(updateQuery, [newType, email], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      if (result.affectedRows > 0) {
        // Log success message to the console
        console.log('User updated');
        callback(null, result); // Return the updated user
      } else {
        callback(null, null); // User not found or not updated
      }
    }
  });
}


function getAllManagers(callback) {
  // Perform a query to fetch all managers
  connection.query('SELECT * FROM usertable WHERE type = "manager"', (err, managers) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, managers);
    }
  });
}

function getAllUsers(callback) {
  // Perform a query to fetch all users
  connection.query('SELECT * FROM usertable WHERE type = "user"', (err, users) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, users);
    }
  });
}


function createTask(taskData, callback) {
  connection.query('INSERT INTO task SET ?', taskData, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}

function checkUserAssociated(managerEmail, userEmail, callback) {
  const query = 'SELECT * FROM task WHERE managerEmail = ? AND userEmail = ?';
  connection.query(query, [managerEmail, userEmail], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      // If rows are found, it means the association exists
      callback(null, rows.length > 0);
    }
  });
}




function getAllUsersForManager2(userEmail, callback) {
  const manageremail = userEmail; // Replace with the specific manager's email

  connection.query('SELECT useremail, task, status FROM task WHERE manageremail = ?', [manageremail], (err, user) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, user);
      console.log(user);
    }
  });
}






function updateTask(useremail, managerEmail, newTask, description, callback) {
  const updateQuery = 'UPDATE task SET task = ?, description = ? WHERE manageremail = ? AND useremail = ?';

  // Log the query and parameters
  console.log('Executing SQL:', updateQuery);
  console.log('Parameters:', [newTask, description, managerEmail, useremail]);

  connection.query(updateQuery, [newTask, description, managerEmail, useremail], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, null);
    } else {
      if (result.affectedRows > 0) {
        console.log('Task updated successfully:', result);
        callback(null, result);
      } else {
        console.log('No rows updated.');
        callback(null, null);
      }
    }
  });
}





function getalltask(userEmail, callback) {
  connection.query('SELECT task, status, description FROM task WHERE useremail = ?', [userEmail], (err, tasks) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, tasks);
      console.log(tasks);
    }
  });
}













function updateTaskStatus( userEmail ,task, status, callback) {
  const useremail = userEmail; // Hardcoded user email

  const updateQuery = 'UPDATE task SET status = ? WHERE useremail = ? AND task = ?';

  connection.query(updateQuery, [status, useremail, task], (err, result) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      console.log('Repository - Task status updated:', result); // Debugger
      if (result.affectedRows > 0) {
        callback(null, result);
      } else {
        callback(null, null); // No rows were updated (task or user not found)
      }
    }
  });
}



module.exports = { 
  createUser,
  findUserByEmail, 
  findUserById, 
  updateUserType,
  getAllManagers, 
  getAllUsers, 
  createTask, 
  getAllUsersForManager2, 
  updateTask,
  getalltask,
  updateTaskStatus,
  checkUserAssociated
  
};
