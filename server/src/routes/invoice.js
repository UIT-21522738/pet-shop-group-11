const express = require('express')
const router = express.Router();

const InvoiceController = require('../app/controllers/InvoiceController');

// tạo hóa đơn
router.post('/create', InvoiceController.pCreateInvoice);

// lấy thông tin hóa đơn
router.post('/get', InvoiceController.pGetInvoice);

// tìm hóa đơn lấy thông tin chi tiết
router.post('/search', InvoiceController.pSearchInvoice);

//kiểm tra doanh thu theo tháng
router.post('/revenue/month', InvoiceController.pRevenueMonth);

module.exports = router;