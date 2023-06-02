const Staff = require('../models/Users');

class StaffController {
    // [POST] /staff/create
    pCreateStaff(req, res, next) {
        if ( 
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' ||
            typeof req.body.shift === 'undefined' ||
            typeof req.body.salary === 'undefined' ||
            typeof req.body.address === 'undefined'         
        ) {
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        Staff.findOne({phoneNumber: req.body.phoneNumber})
        .then(data => {
            if (data) {
                res.statusCode = 402;
                res.json({msg: "staff is existing"});
                return;
            }
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
            return;
        })

        const staff = new Staff(req.body);

        staff.save()
        .then(() => {
            res.statusCode = 200;
            res.json({msg: "success"});
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
        })

    }

    // [POST] /staff/update
    pUpdateStaff(req, res, next) {
        if (
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName  === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' ||
            typeof req.body.shift === 'undefined' ||
            typeof req.body.salary === 'undefined' ||
            typeof req.body.address === 'undefined' ||
            typeof req.body.id === 'undefined'
        ) {
            res.statusCode =404; res.json({msg: "invalid data"});
            return;
        }

        Staff.findOne({phoneNumber: req.body.phoneNumber})
        .then(data => {
            if (data) {
                res.statusCode =402; res.json({msg: "phone number is existed"});
                return;
            }
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })

        Staff.findByIdAndUpdate(id, req.body)
        .then(() => {
            res.statusCode =200; res.json({msg:"success"});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        });
    }

    // [POST] /staff/search
    pSearchStaff(req, res, next) {
        if (typeof req.body.phoneNumber === 'undefined') {
            res.statusCode =404; res.json({msg: "invalid phone number"});
            return;
        }

        Staff.findOne({phoneNumber: req.body.phoneNumber})
        .then(data => {
            if (data) {
                res.statusCode =200; res.json({msg: "success", data: data});
                return;
            }
            res.statusCode =402; res.json({msg: "phone number not found"});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        });
    }

    // [POST] /staff/delete
    pDeleteStaff(req, res, next) {
        if (typeof req.body.id === 'undefined') {
            res.statusCode =404; res.json({msg: "invalid id"});
            return;
        }

        Staff.deleteById(req.body.id)
        .then(() => {
            res.statusCode =200; res.json({msg: "success"});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
    }

    // [PUT] /staff/salary/update/:id
    pUpdateSalary(req, res, next) {
        if (typeof req.body.salary === 'undefined')
        {
            res.statusCode = 404;
            res.json({msg: "invalid data"});
            return;
        }

        Staff.findById(req.params.id)
        .then((data) => {
            if (data) {
                Staff.updateOne({_id: req.params.id}, {salary: salary})
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
            res.statusCode = 402;
            res.json({msg: "Not found"});
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
        });
    }

    // [PUT] /staff/shift/change/:id
    pChangeShift(req, res, next) {
        if (typeof req.body.shift === 'undefined') {
            res.statusCode = 404;
            res.json({msg: "invalid data"})
            return;
        }

        Staff.findById({_id: req.params.id})
        .then((data) => {
            if (data) {
                Staff.updateOne({_id: req.params.id}, {shift: req.body.shift})
                .then(() => {
                    res.statusCode = 200;
                    res.json({msg: "success"});
                    return;
                })
                .catch(() => {
                    res.statusCode = 500;
                    res.json({msg: "success"});
                    return;
                })
            }

            res.statusCode = 402;
            res.json({msg: "not found"});
        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({msg: err.message});
        });
    }
}

module.exports = new StaffController();