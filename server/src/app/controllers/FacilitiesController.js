const Facilities = require('../models/Facilities');

class FacilitiesController {
    //[POST] /facilities/add
    pAddFacilities(req, res, next) {
        if (
            typeof req.body.name === 'undefined' ||
            typeof req.body.description === 'undefined' ||
            typeof req.body.quantity === 'undefined' ||
            typeof req.body.location === 'undefined'
        ) { 
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        const facility = new Facilities(req.body);
        facility.save()
        .then(() => {
            res.statusCode = 200;
            res.json({msg: "success"});
            return;
        })
        .catch(err => {
            res.statusCode = err.statusCode;
            res.json({msg: err.message});
            return;
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
            typeof req.body.id === 'undefined' || 
            (typeof req.body.quantity === 'undefined' &&
            typeof req.body.location === 'undefined')
        ) {
            res.statusCode = 404;
            res.json({ msg: "invalid data" });
            return;
        }

        Facilities.findById(req.body.id)
        .then(data => {
            if (data) {
                //nếu cập nhật quantity
                if (typeof req.body.location === 'undefined') {
                    Facilities.findByIdAndUpdate(req.body.id, {quantity: req.body.quantity})
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
                    Facilities.findByIdAndUpdate(req.body.id, {location: req.body.location})
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
                    Facilities.findByIdAndUpdate(req.body.id, {location: req.body.location, quantity: req.body.quantity})
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

    //[DELETE] /facilities/delete/:id
    dDeleteFacilities(req, res, next) {
        Facilities.findByIdAndDelete(req.params.id)
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