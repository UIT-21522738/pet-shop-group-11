const Discount = require('../models/Discounts');

class DiscountController {
    //[POST] /discount/create
    pCreateDiscount(req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.description === 'undefined' ||
            typeof req.body.startDate === 'undefined' ||
            typeof req.body.startMonth === 'undefined' ||
            typeof req.body.startYear === 'undefined' ||
            typeof req.body.endMonth === 'undefined' ||
            typeof req.body.endYear === 'undefined' ||
            typeof req.body.endDate === 'undefined' ||
            typeof req.body.percent === 'undefined' 
        ) {
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        const startDate = new Date();
        const endDate = new Date();

        startDate.setDate(req.body.startDate);
        startDate.setMonth(req.body.startMonth);
        startDate.setFullYear(req.body.startYear);
        startDate.setDateHours(0,0,0);

        endDate.setDate(req.body.endDate);
        endDate.setMonth(req.body.endMonth);
        endDate.setFullYear(req.body.endYear);
        endDate.setDateHours(23,59,59);

        const discount = {
            name: req.body.name,
            description: req.body.description,
            startDate: startDate,
            endDate: endDate,
            discount_percentage: req.body.percent
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