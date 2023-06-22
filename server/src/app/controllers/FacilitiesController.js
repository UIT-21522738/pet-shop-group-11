const Facilities = require('../models/Facilities');
const User = require('../models/Users');
const jwt = require('jsonwebtoken')

class FacilitiesController {
    //[POST] /facilities/add
    async pAddFacilities(req, res, next) {
        if (
            (typeof req.body.name === 'undefined' &&
            typeof req.body.description === 'undefined') ||
            typeof req.body.quantity === 'undefined' ||
            typeof req.body.location === 'undefined' ||
            typeof req.body.token === 'undefined' 
        ) { 
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        try {var id = jwt.verify(req.body.token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
            return;
        }
        var body = req.body;

        User.findById(id)
        .then((data) => {
            body.creater = data.code;
        })
        .catch(err => {})
        var count = await Facilities.countDocuments();
        req.body.code = `TB${count+1}`

        Facilities.findOne({name: req.body.name})
        .then((data) => {
            if (data){
                res.statusCode = 404;
                res.json({msg: "facilities exists"});
            }
            else {
                const facility = new Facilities(req.body);
                facility.save()
                .then(() => {
                    res.statusCode = 200;
                    res.json({msg: "success"});
                    return;
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.json({msg: err.message});
                    return;
                })      
            }
        })
    }

    //[GET] /facilities/searchall
    gSearchAll(req,res,next) {
        Facilities.find()
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "success", data: data});
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: "error"})
            return;
        })
    }

    //[POST] /facilities/search/
    pSearch(req, res, next) {
        if (typeof req.body.name === "undefined") { 
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        Facilities.findOne({name: req.body.name})
        .then(data => {
            if (data) {
                res.statusCode = 200;
                res.json({msg: "success", data: data});
                return;
            }
            res.statusCode = 404;
            res.json({msg: "not found"});
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
        })
    }

    // [PUT] /facilites/update
    pUpdateFacilities(req, res, next) {
        if (
            typeof req.body.code === 'undefined' || 
            (typeof req.body.quantity === 'undefined' &&
            typeof req.body.location === 'undefined')
        ) {
            res.statusCode = 404;
            res.json({ msg: "invalid data" });
            return;
        }

        Facilities.findOne({code: req.body.code})
        .then(data => {
            if (data) {
                //nếu cập nhật quantity
                if (typeof req.body.location === 'undefined') {
                    Facilities.updateOne({code: req.body.code}, {quantity: req.body.quantity})
                    .then(() => {
                        res.statusCode = 200;
                        res.json({msg: "success"});
                        return;
                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.json({msg: err.message});
                        return;
                    })
                }
                // nếu cập nhật location
                else if (typeof req.body.quantity === 'undefined') {
                    Facilities.updateOne({code: req.body.code}, {location: req.body.location})
                    .then(() => {
                        res.statusCode = 200;
                        res.json({msg: "success"});
                        return;
                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.json({msg: err.message});
                        return;
                    })
                }
                //nếu cập nhật cả 2
                else {
                    Facilities.updateOne({code: req.body.code}, {location: req.body.location, quantity: req.body.quantity})
                    .then(() => {
                        res.statusCode = 200;
                        res.json({msg: "success"});
                        return;
                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.json({msg: err.message});
                        return;
                    })
                }
            }
        })
    }

    //[DELETE] /facilities/delete
    dDeleteFacilities(req, res, next) {
        if (typeof req.body.code === "undefined") {
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }
        Facilities.deleteOne({code: req.body.code})
        .then(() => {
            res.statusCode =200; res.json({msg: "success"});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
    }
}

module.exports = new FacilitiesController();