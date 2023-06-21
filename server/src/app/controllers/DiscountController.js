const Discount = require('../models/Discounts');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

class DiscountController {
    //[POST] /discount/create
    async pCreateDiscount(req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.description === 'undefined' ||
            typeof req.body.startDate === 'undefined' ||
            typeof req.body.startMonth === 'undefined' ||
            typeof req.body.startYear === 'undefined' ||
            typeof req.body.endMonth === 'undefined' ||
            typeof req.body.endYear === 'undefined' ||
            typeof req.body.endDate === 'undefined' ||
            typeof req.body.percent === 'undefined' ||
            typeof req.body.token === 'undefined' 
        ) {
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        const startDate = new Date();
        const endDate = new Date();

        // +7 để set múi giờ Việt Nam
        startDate.setDate(parseInt(req.body.startDate) + 7);
        startDate.setMonth(parseInt(req.body.startMonth) - 1);
        startDate.setFullYear(parseInt(req.body.startYear));
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);

        endDate.setDate(parseInt(req.body.endDate) + 7);
        endDate.setMonth(parseInt(req.body.endMonth) - 1);
        endDate.setFullYear(parseInt(req.body.endYear));
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
        .then(data => {
            creater = data.code;
        })

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