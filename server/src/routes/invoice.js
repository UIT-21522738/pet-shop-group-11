const express = require('express')
const router = express.Router();

const InvoiceController = require('../app/controllers/InvoiceController');

router.post('/invoice/create', InvoiceController.pCreateInvoice);
router.post('/invoice/get', InvoiceController.pGetInvoice);
router.post('/invoice/search', InvoiceController.pSearchInvoice);
router.post('/invoice/revenue/month', InvoiceController.pRevenueMonth);

module.exports = router;