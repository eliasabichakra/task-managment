const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const maxAge = 1000;
const UserDTO = require('../model/userDTO');




function getSignUp(req, res) {
  res.render('signup');
}




function postSignUp(req, res) {
  const { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    req.flash('error1', 'Email and password are required');
    return res.render('signup_page');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    req.flash('error2', 'Invalid email format');
    return res.render('signup');
  }

  // Validate password requirements
  const uppercaseRegex = /[A-Z]/;

  if (password.length < 8) {
    req.flash('error3', 'Password must be at least 8 characters long');
    return res.render('signup');
  }

  if (!uppercaseRegex.test(password)) {
    req.flash('error4', 'Password must contain at least one uppercase letter');
    return res.render('signup');
  }

  // Check if the user already exists in the database
  userService.findUserByEmail(email, (err, user) => {
    if (err) {
      console.error(err);
      req.flash('error5', 'Error checking user existence');
      return res.render('signup');
    }

    if (user) {
      req.flash('error6', 'User with this email already exists');
      return res.render('signup');
    }

    // If the user doesn't exist, proceed to create the new user
    userService.createUser({ email, password }, (err, result) => {
      if (err) {
        console.error(err);
        req.flash('error7', 'Error creating user');
        return res.render('signup');
      } else {
        req.flash('success', 'User created successfully');
        res.redirect('/signin');
      }
    });
  });
}






function getSignIn(req, res) {
  res.render('signin');
}


// token

function createToken(id) {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge,
  });
}



function postSignIn(req, res) {

  const { email, password } = req.body;

  userService.findUserByEmail(email, (err, userDTO) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error finding user');
    } else {
      console.log('UserDTO:', userDTO); // Add this line to log userDTO
      
      if (userDTO && userDTO.password === password) {
        const token = createToken(userDTO.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        
        req.session.userEmail = userDTO.email;
        console.log(req.session.userEmail)

        switch (userDTO.userType) {
          case 'admin':
            res.redirect('/admin');
            break;
          case 'manager':
            res.redirect('/manager');
            break;
          case 'user':
            res.redirect('/user');
            break;
          default:
            res.status(403).send('Access denied');
            break;
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
    }
  });
}



function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/signin');
    }
  });
}

function updateType(req, res) {
  const { userEmail, userType } = req.body;

  userService.updateUserTypeByEmail(userEmail, userType, (err, result) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Error updating user type');
      res.status(500).send('Error updating user type');
    } else {
      if (result) {
        req.flash('success', 'User type updated successfully');
        res.redirect('/admin'); // Redirect back to admin page after updating
      } else {
        req.flash('error', 'User not found or not updated');
        res.status(404).send('User not found or not updated');
      }
    }
  });
}











function renderAdminPage(req, res) {
  res.render('admin_page');
}

function renderManagerPage(req, res) {
  res.render('manager_page');
}


function renderUserPage(req, res) {
  res.render('user_page');
}





function showAllManagerAndUser(req, res) {
  let managers, users;

  userService.getAllManagers((err, allManagers) => {
    if (err) {
      console.error(err);
      managers = [];
    } else {
      managers = allManagers;
    }

    userService.getAllUsers((err, allUsers) => {
      if (err) {
        console.error(err);
        users = [];
      } else {
        users = allUsers;
      }

      res.render('admin_page', { managers, users });
    });
  });
}

// Repository function: insertManagerAndUser
function insertManagerAndUser(req, res) {
  const { managerSelect, userSelect } = req.body; 
  const taskData = {
    managerEmail: managerSelect,
    userEmail: userSelect
  };

  // Check if the association already exists using userService
  userService.checkUserAssociated(managerSelect, userSelect, (err, isAssociated) => {
    if (err) {
      console.error(err);
      req.flash('error1', 'Error checking association');
      return res.status(500).send('Error checking association');
    }

    if (isAssociated) {
      req.flash('error1', 'User already associated with this manager');
      return res.redirect('/admin');
    }

    // If the association doesn't exist, create the association using userService
    userService.createTask(taskData, (err, result) => {
      if (err) {
        console.error(err);
        req.flash('error1', 'Error creating task');
        return res.status(500).send('Error creating task');
      } else {
        req.flash('success1', 'Users added for manager successfully');
        res.redirect('/admin');
      }
    });
  });
}





function showAlluserforManager(req, res) {
  const userEmail = req.session.userEmail; // Retrieve manager's email from the session
  let users; // Assuming this will hold the users for the manager

  userService.getAllUsers2(userEmail, (err, allusersformanager) => {
    if (err) {
      console.error(err);
      users = []; // Handle error case appropriately
    } else {
      users = allusersformanager;
    }

    res.render('manager_page', { allusersformanager });
  });
}

// create task and description
function updateTask(req, res) {
  const { useremail, task, description } = req.body;
  const userEmail = req.session.userEmail;

  userService.updateTask(useremail, userEmail, task, description, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating task');
    } else {
      req.flash('success', 'Task successfully updated!');
      return res.redirect('/manager');
    }
  });
}



function showalltask(req, res) {
  const userEmail = req.session.userEmail;
  console.log('show email:', userEmail);

  userService.getalltask(userEmail, (err, alltasks) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching tasks');
    } else {
      res.render('user_page', { alltasks }); // Pass alltasks to the template
      
    }
  });
}



function updateTaskStatus(req, res) {
  const { task, status } = req.body;
  const userEmail = req.session.userEmail;

  userService.updateTaskstatus(userEmail, task, status, (err, result) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Error updating task status');
      res.status(500).send('Error updating task status');
    } else {
      req.flash('success', 'Task status updated successfully');
      res.redirect('/user');
    }
  });
}
















module.exports = {
  getSignUp,
  postSignUp,
  getSignIn,
  postSignIn,
  logout,
  renderUserPage,
  renderManagerPage,
  renderAdminPage,
  createToken,
  updateType,
  showAllManagerAndUser,
  insertManagerAndUser,
  showAlluserforManager,
  updateTask,
  showalltask,
  updateTaskStatus
 
  
};
