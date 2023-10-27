const Customer = require('../models/Customers');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

class CustomerController {
    //[POST] /customer/add
    //thêm một khách hàng
    async addCustomer(req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' &&
            (typeof req.body.vip === 'undefined') &&
            typeof req.body.gender === 'undefined' ||
            typeof req.body.birthday === 'undefined' ||
            typeof req.body.token === 'undefined' 
        ) {
            res.statusCode = 404;
            res.json({ msg: "invalid data" });
            return;
        }
        
        try {var id = jwt.verify(req.body.token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
            return;
        }
        var body = req.body;
        const count = await Customer.countDocuments({});
        body.code = `KH${parseInt(count)+1}`;

        const parts = req.body.birthday.split('/');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        var birthday = new Date(year, month - 1, day);

        body.birthday = birthday;
        console.log(birthday)

        Users.findById(id)
        .then(data => {
            body.creater = data.code;
        })

        try {
            const data = await Customer.findOne({ phoneNumber: req.body.phoneNumber });
            if (data) {
                res.statusCode = 402;
                res.json({ msg: "customer is existing" });
                return;
            }
    
            let newCustomer = new Customer(body);
    
            await newCustomer.save();
            res.statusCode = 200;
            res.json({ msg: "success" });
        } catch (err) {
            res.statusCode = 500;
            res.json({ msg: err.message });
        }
    }

    //[DELETE] /customer/delete
    // xóa một khách hàng
    deleteCustomer(req, res, next) {
        if (typeof req.body.phoneNumber === 'undefined') {
            res.statusCode =404; res.json({msg: "invalid phone number"});
            return;
        }

        Customer.deleteOne({phoneNumber: req.body.phoneNumber})
        .then(() => {
            res.statusCode =200; res.json({msg: "success"});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
    }

    // [POST] /customer/search
    searchCustomer(req, res, next) {
        if (typeof req.body.phoneNumber === 'undefined') {
            res.statusCode =404; res.json({msg: 'invalid phone number'});
            return;
        }

        Customer.findOne({phoneNumber: req.body.phoneNumber})
        .then(data => {
            res.statusCode =200; res.json({msg: 'success', data: data});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
    }

    // [PUT] /customer/update
    updateCustomer(req, res, next) {
        if (
            (typeof req.body.name === 'undefined' &&
            typeof req.body.phoneNumber === 'undefined' &&
            typeof req.body.gender === 'undefined' ) ||
            typeof req.body.currentPhone === 'undefined' 
        ) {
            res.statusCode = 404;
            res.json({ msg: "invalid data" });
            return;
        }
    
        Customer.updateOne({phoneNumber: req.body.currentPhone}, req.body)
        .then(() => {
            res.statusCode = 200;
            res.json({ msg: 'success' });
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({ msg: err.message });
            return;
        });
    }
        
    //không xài
    //[POST] /customer/vip/update/:id
    pUpdateVip(req, res, next) {
        Customer.findById(req.params.id)
        .then(data => {
            if (data) {
                Customer.findByIdAndUpdate(req.params.id, {vip: true})
                .then(() => {
                    res.statusCode =200; res.json({msg: 'success'});
                    return;
                })
                .catch(err => {
                    res.statusCode =500; res.json({msg: err.message});
                    return;
                })
            }
            else {
                res.statusCode = 402; res.json({msg: "not found"});
            }
            
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
        })
    }

    //không xài
    //[GET] /customer/vip/check
    gCheckVip(req, res, next) {
        if (typeof req.body.code === 'undefined') {
            res.statusCode = 404;
            res.json({msg: "invalid code"});
        }

        Customer.findOne({code: req.body.code})
        .then(data => {
            if (data) {
                res.statusCode = 200; res.json({msg:'success', data: data.vip});
                return;
            }
            res.statusCode = 402; res.json({msg:'not found'});
            return;
        })
        .catch(err => { res.statusCode = err.message; res.json({msg: err.message});});
    }

    //[GET] /customer/getall
    gAllCustomer(req, res, next) {
        Customer.find()
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "success", data: data});
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
            return;
        })
    }

    // [GET] /customer/newCustomer
    gNewCustomer(req, res, next) {
        const startOfMonth = new Date();
        startOfMonth.setMonth(startOfMonth.getMonth() - 1);

        const endOfMonth = new Date();

        Customer.find({createdAt: {$gte: startOfMonth, $lte: endOfMonth}})
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "success", data: data});
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: "error"});
        });
    }
}

module.exports = new CustomerController();