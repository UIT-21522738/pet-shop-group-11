const express = require('express');
const router = express.Router();

const discountController = require('../app/controllers/DiscountController');

// Tạo discount
router.post('/create', discountController.pCreateDiscount);

// Kiểm tra discount
router.get('/check', discountController.gCheckDiscount);

module.exports = router;