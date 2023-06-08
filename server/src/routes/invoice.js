const express = require('express')
const router = express.Router();

const InvoiceController = require('../app/controllers/InvoiceController');

// tạo hóa đơn
router.post('/invoice/create', InvoiceController.pCreateInvoice);

// lấy thông tin hóa đơn
router.post('/invoice/get', InvoiceController.pGetInvoice);

// tìm hóa đơn lấy thông tin chi tiết
router.post('/invoice/search', InvoiceController.pSearchInvoice);

//kiểm tra doanh thu theo tháng
router.post('/invoice/revenue/month', InvoiceController.pRevenueMonth);

module.exports = router;