const router = require('express').Router();
const medController = require('../controllers/medication-controller');



router
    .route("/:med_id")
    .get(medController.medComments)
    .post(medController.addMedComment)
router.route("/:comment_id")
    .delete(medController.deleteMedComment)

module.exports = router;