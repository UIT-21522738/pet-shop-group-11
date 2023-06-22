const express = require('express');
const router = express.Router();

const customer = require('../app/controllers/CustomerController');

// lấy các khách hàng mới trong tháng
router.get('/newcustomer', customer.gNewCustomer);

// Lấy danh sách toàn bộ khách hàng
router.get('/getall', customer.gAllCustomer);

// Update chỉ số vip
router.post('/vip/update/:id', customer.pUpdateVip)

//check vip
router.get('/vip/check/:id', customer.gCheckVip)

// [POST] /customer/add
router.post('/add', customer.addCustomer);

// [DELETE] /customer/delete
router.delete('/delete', customer.deleteCustomer);

// [PUT] /customer/update/:id
router.put('/update/:id', customer.updateCustomer);

// [POST] /customer/search
router.post('/search', customer.searchCustomer);

module.exports = router;
