const { response } = require('express');
const Discount = require('../models/Discounts');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

class DiscountController {
    //[POST] /discount/create
    async pCreateDiscount(req, res, next) {
        if (
            (typeof req.body.name === 'undefined' &&
            typeof req.body.description === 'undefined') ||
            typeof req.body.startDay === 'undefined' ||
            typeof req.body.endDay === 'undefined' ||
            typeof req.body.percent === 'undefined' ||
            typeof req.body.token === 'undefined' 
        ) {
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        const parts = req.body.startDay.split('/');
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        const parts1 = req.body.startDay.split('/');
        const daye = parseInt(parts1[0]);
        const monthe = parseInt(parts1[1]);
        const yeare = parseInt(parts1[2]);

        const startDate = new Date();
        const endDate = new Date();

        startDate.setDate(parseInt(day));
        startDate.setMonth(parseInt(month) - 1);
        startDate.setFullYear(parseInt(year));
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);

        endDate.setDate(parseInt(daye));
        endDate.setMonth(parseInt(monthe) - 1);
        endDate.setFullYear(parseInt(yeare));
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        try {var id = jwt.verify(req.body.token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
            return;
        }

        var creater = '';
        Users.findById(id)
        .then(async data => {
            creater = data.code;
            if (data.role === 'Quản lý') {
                const count = await Users.countDocuments();
                if (count < 9) {
                    var code = `CP0${count+1}`;
                }
                else {
                    var code = `CP${count+1}`;
                }
        
                const discount = {
                    name: req.body.name,
                    description: req.body.description,
                    startDate: startDate,
                    endDate: endDate,
                    percent: req.body.percent,
                    creater: creater,
                    idCoupon: code
                }
        
                const newDiscount = new Discount(discount);
                newDiscount.save()
                .then(() => {
                    res.statusCode = 200;
                    res.json({msg: "success"})
                })
                .catch((err) => {
                    res.statusCode = 500;
                    res.json({msg: err.message});
                })
            } else {
                res.statusCode = 401;
                res.json({msg: "Not have permission"});
            }
        })

        
    }

    // [GET] /discount/getall
    async getAll(req, res, next) {
        Discount.find()
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "Success", data: data});
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
            return;
        });
    }

    // [PUT] /discount/update
    async pUpdate(req, res, next) {
        if ((
            typeof req.body.name === 'undefined' && 
            typeof req.body.description === 'undefined' && 
            typeof req.body.percent === 'undefined' && 
            typeof req.body.startDay === 'undefined' && 
            typeof req.body.endDay === 'undefined') || 
            typeof req.body.idCoupon === 'undefined' ||
            typeof req.body.token === 'undefined'
        ) {
            res.statusCode = 404;
            res.json({msg: "Invalid data"});
            return;
        }

        try {var id = jwt.verify(req.body.token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
            return;
        }

        Users.findById(id)
        .then(async data => {
            if (data) {
                if (data.role === 'Quản lý') {
                    if (req.body.startDay){
                        var startDate = new Date();
                        const parts = req.body.startDay.split('/');
                        const day = parseInt(parts[0]);
                        const month = parseInt(parts[1]);
                        const year = parseInt(parts[2]);
                        startDate.setDate(parseInt(day));
                        startDate.setMonth(parseInt(month) - 1);
                        startDate.setFullYear(parseInt(year));
                        startDate.setHours(0);
                        startDate.setMinutes(0);
                        startDate.setSeconds(0);
                        req.body.startDate = startDate;
                    }
                    if (req.body.endDay) {
                        var endDate = new Date();
                        const parts = req.body.endDay.split('/');
                        const day = parseInt(parts[0]);
                        const month = parseInt(parts[1] - 1);
                        const year = parseInt(parts[2]);
                        endDate.setDate(parseInt(day));
                        endDate.setMonth(parseInt(month));
                        endDate.setFullYear(parseInt(year));
                        endDate.setHours(0);
                        endDate.setMinutes(0);
                        endDate.setSeconds(0);
                        req.body.endDate = endDate;
                    }
                    await new Promise((resolve, reject) => { setTimeout(resolve,500)})

                    Discount.updateOne({idCoupon: req.body.idCoupon}, req.body)
                    .then(() => {
                        res.statusCode =200; res.json({msg:"success"});
                        return;
                    })
                    .catch(err => {
                        res.statusCode =500; res.json({msg: err.message});
                    })
                }
            } else {
                res.statusCode = 402; res.json({msg: 'not found'});
            }
        })
        
    }

    // [DELETE] /discount/delete
    async dDiscount(req, res, next) {
        if (typeof req.body.idCoupon === 'undefined' || typeof req.body.token === 'undefined') { 
            res.statusCode = 404;
            res.json({msg: 'Invalid data'});
            return;
        }
        try {var id = jwt.verify(req.body.token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
            return;
        }

        Users.findById(id)
        .then(async data => {
            if (data) {
                if (data.role === 'Quản lý') {
                    await Discount.deleteOne({idCoupon: req.body.idCoupon});
                    res.statusCode = 200;
                    res.json({msg: "success"});
                    return;
                } else {
                    res.statusCode = 401;
                    res.json({msg: "Not have permission"});
                    return;
                }
            }
            else {
                res.statusCode = 402; res.json({msg: "not found"}); return;
            }
        })
        
    }

    async pSearch(req, res, next) {
        if (typeof req.body.idCoupon === 'undefined') {
            res.statusCode = 404; res.json({msg:"invalid data"}); return;
        }

        Discount.findOne({idCoupon: req.body.idCoupon})
        .then(data => {
            if (data) 
            {
                res.statusCode = 200; res.json({msg:"success", data: data}); return;
            }
            else {
                res.statusCode = 402; res.json({msg:"not found"}); return;
            }
        })
    }

    // [GET] /discount/check
    async gCheckDiscount(req, res, next) {
        let date = new Date(Date.now());
        Discount.find({startDate: {$lt: date}, endDate: {$gt: date}})
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "success", data: data});
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
        });
    }
}

module.exports = new DiscountController();