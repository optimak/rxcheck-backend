const router = require('express').Router();
const userController = require('../controllers/user-controller');


router
  .route("/user-profile")
  .get(userController.getProfile);
router
  .route("/register")
  .post(userController.register)
  .post(userController.login)






module.exports = router;