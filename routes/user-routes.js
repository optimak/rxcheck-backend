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

router
  .route("/:user_id/meds")
  .get(userController.userMeds)
  .post(userController.addUserMeds);

router
  .route("/:user_id/meds/:med_id")
  .delete(userController.deleteUserMeds)







module.exports = router;