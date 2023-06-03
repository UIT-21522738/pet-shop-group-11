const express = require('express');
const router = express.Router();

const StaffController = require('../app/controllers/StaffController');

router.post('/staff/ws/:id', StaffController.pGetWorkSchedule);
router.post('staff/salary/get/:id', StaffController.pGetSalary);
router.post('/staff/create', StaffController.pCreateStaff);
router.post('/staff/update', StaffController.pUpdateStaff);
router.post('/staff/delete', StaffController.pDeleteStaff);
router.post('/staff/search', StaffController.pSearchStaff);
router.put('/staff/shift/change/:id', StaffController.pChangeShift);
router.put('/staff/salary/update/:id', StaffController.pUpdateSalary);

module.exports = router;