const router = require('express').Router();
const medController = require('../controllers/medication-controller');


router
    .route("/")
    .get(medController.index);
router
    .route("/search")
    .get(medController.conditionMedications);
module.exports = router;