const Staff = require('../models/Users');

class StaffController {
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

    
}

module.exports = new StaffController();