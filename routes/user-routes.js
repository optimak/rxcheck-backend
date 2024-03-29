const router = require('express').Router();
const userController = require('../controllers/user-controller');


router
  .route("/profile")
  .get(userController.getProfile);
router
  .route("/register")
  .post(userController.register);
router
  .route("/login")
  .post(userController.login);






module.exports = router;