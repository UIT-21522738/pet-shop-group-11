const Customer = require('../models/Customers')

class CustomerController {
    //[POST] /customer/add
    //thêm một khách hàng
    addCustomer(req, res, next) {
        if (
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName  === 'undefined' ||
            typeof req.body.phone     === 'undefined' ||
            typeof req.body.vip       === 'undefined'
        ) {
            res.statusCode =404; res.json({msg: "invalid data"});
            return;
        }

        Customer.findOne({phoneNumber: req.body.phone})
        .then(data => {
            if (data) {
                res.statusCode =402; res.json({msg: "customer is existing"});
                return;
            }
        })

        let newCustomer = new Customer(req.body);

        newCustomer.save()
        .then(() => {
            res.statusCode =200; res.json({msg: "success"});
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); });
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

    // [PUT] /customer/update/:id
    updateCustomer(req, res, next) {
        if (
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName  === 'undefined' ||
            typeof req.body.phone     === 'undefined' ||
            typeof req.body.vip       === 'undefined'
        ) {
            res.statusCode =404; res.json({msg: "invalid data"});
            return;
        }

        Customer.findOne({phoneNumber: req.body.phone})
        .then(data => {
            if (data) {
                res.statusCode =402; res.json({msg: "customer's phone number is existing"});
                return;
            }
        })

        Customer.updateOne({phoneNumber: req.params.id}, req.body)
        .then(data => {
            res.statusCode =200; res.json({msg: 'success'});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
        
    }
}

module.exports = new CustomerController();