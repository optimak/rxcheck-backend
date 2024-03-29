const router = require('express').Router();
const medController = require('../controllers/medication-controller');



router
    .route("/:med_id")
    .get(medController.medComments)
    .post(medController.addMedComments)
module.exports = router;