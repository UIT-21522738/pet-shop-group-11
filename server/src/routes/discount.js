const express = require('express');
const router = express.Router();

const discountController = require('../app/controllers/DiscountController');

// Search
router.post('/search', discountController.pSearch)

// Xóa discount
router.delete('/delete', discountController.dDiscount);

// Lấy toàn bộ discount
router.get('/getall', discountController.getAll)

// Sửa discount
router.put('/update', discountController.pUpdate)

// Tạo discount
router.post('/create', discountController.pCreateDiscount);

// Kiểm tra discount
router.get('/check', discountController.gCheckDiscount);

module.exports = router;