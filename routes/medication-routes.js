const router = require('express').Router();
const medController = require('../controllers/medication-controller');


router
    .route("/")
    .get(medController.index);
router
    .route("/search")
    .get(medController.conditionMedications);

// router
//     .route("/:med_id")
//     .get(medController.medComments)
module.exports = router;