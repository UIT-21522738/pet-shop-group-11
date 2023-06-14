const Customer = require('../models/Customers')

class CustomerController {
    //[POST] /customer/add
    //thêm một khách hàng
    async addCustomer(req, res, next) {
        if (
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' ||
            typeof req.body.vip === 'undefined'
        ) {
            res.statusCode = 404;
            res.json({ msg: "invalid data" });
            return;
        }
    
        try {
            const data = await Customer.findOne({ phoneNumber: req.body.phoneNumber });
            if (data) {
                res.statusCode = 402;
                res.json({ msg: "customer is existing" });
                return;
            }
    
            let newCustomer = new Customer(req.body);
    
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

    // [PUT] /customer/update/:id
    updateCustomer(req, res, next) {
        if (
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' ||
            typeof req.body.vip === 'undefined'
        ) {
            res.statusCode = 404;
            res.json({ msg: "invalid data" });
            return;
        }
    
        let sentResponse = false;
    
        Customer.findById(req.params.id)
        .then(customer => {
            if (!customer) {
                sentResponse = true;
                res.statusCode = 402;
                res.json({ msg: "customer is not found" });
                return;
            }

            return Customer.updateOne({ _id: req.params.id }, req.body);
        })
        .then(() => {
            if (!sentResponse) {
                res.statusCode = 200;
                res.json({ msg: 'success' });
            }
        })
        .catch(err => {
            if (!sentResponse) {
                res.statusCode = 500;
                res.json({ msg: err.message });
            }
        });
    }
        

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

    //[GET] /customer/vip/check/:id
    gCheckVip(req, res, next) {
        Customer.findById(req.params.id)
        .then(data => {
            if (data) {
                res.statusCode = 200; res.json({msg:'success', data: data.vip});
                return;
            }
            res.statusCode = 402; res.json({msg:'not found'});
        })
        .catch(err => { res.statusCode = err.message; res.json({msg: err.message});});
    }
}

module.exports = new CustomerController();