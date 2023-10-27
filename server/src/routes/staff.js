const express = require('express');
const router = express.Router();

const StaffController = require('../app/controllers/StaffController');

// lấy danh sách toàn bộ khách hàng
router.get('/getall', StaffController.gAllStaff);

router.post('/ws/:id', StaffController.pGetWorkSchedule);
router.post('/salary/get', StaffController.pGetSalary);
router.post('/create', StaffController.pCreateStaff);
router.post('/update', StaffController.pUpdateStaff);
router.delete('/delete', StaffController.pDeleteStaff);
router.post('/search', StaffController.pSearchStaff);
router.put('/shift/change/:id', StaffController.pChangeShift);
router.put('/salary/update/:id', StaffController.pUpdateSalary);

module.exports = router;