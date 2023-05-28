const express = require('express');
const router = express.Router();

const customer = require('../app/controllers/CustomerController');

// [POST] /customer/add
router.post('/add', customer.addCustomer);

// [DELETE] /customer/delete
router.delete('/delete', customer.deleteCustomer);

// [PUT] /customer/update/:id
router.put('/update/:id', customer.updateCustomer);

// [POST] /customer/search
router.post('/search', customer.searchCustomer);

module.exports = router;