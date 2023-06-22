const express = require('express');
const router = express.Router();

const facilities = require('../app/controllers/FacilitiesController');

//thêm cơ sở vật chất
router.post('/add', facilities.pAddFacilities);

//lấy danh sách tất cả các sản phẩm
router.get('/searchall', facilities.gSearchAll);

// tìm sản phẩm theo tên
router.post('/search', facilities.pSearch);

// sửa sản phẩm
router.put('/update', facilities.pUpdateFacilities);

// xóa sản phẩm
router.delete('/delete', facilities.dDeleteFacilities);

module.exports = router;