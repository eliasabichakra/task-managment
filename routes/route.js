const express = require('express');
const router = express.Router();
const {  requireAuth , clearJWT } = require('../middlewares/authMiddlewares');
const userController = require('../controllers/userController');




// Signup route
router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp);

// Signin route
router.get('/signin' , clearJWT,userController.getSignIn);
router.post('/signin' ,clearJWT, userController.postSignIn);
// Route for the admin page (protected by authorization middleware)

  
router.get('/admin', requireAuth, userController.showAllManagerAndUser, (req, res) => {
  res.render('admin_page'); // Render the admin page if authenticated
});





router.get('/user', requireAuth, userController.showalltask, (req, res) => {
  res.render('user_page'); // Render the user page if authenticated
});
router.get('/manager', requireAuth, userController.showAlluserforManager,  (req, res) => {
  res.render('manager_page'); // Render the manger page if authenticated
});
router.post('/manager/addtask', userController.updateTask); //
router.post('/user/updatestatus', userController.updateTaskStatus);
// Logout route
router.get('/logout', userController.logout);
router.post('/admin/insertmanageranduser', userController.insertManagerAndUser);

module.exports = router;
