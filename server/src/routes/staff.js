const express = require('express');
const router = express.Router();

const StaffController = require('../app/controllers/StaffController');

router.post('/staff/update', StaffController.pUpdateStaff);
router.post('/staff/delete', StaffController.pDeleteStaff);
router.post('/staff/search', StaffController.pSearchStaff);

module.exports = router;