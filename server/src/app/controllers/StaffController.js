const Staff = require('../models/Users');
const WS = require('../models/Work_schedule');
const jwt = require('jsonwebtoken');

class StaffController {
    // [POST] /staff/create
    pCreateStaff(req, res, next) {
        if ( 
            typeof req.body.username === 'undefined' ||
            typeof req.body.password === 'undefined' ||
            typeof req.body.firstName === 'undefined' ||
            typeof req.body.lastName === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' ||
            typeof req.body.shift === 'undefined' ||
            typeof req.body.salary === 'undefined' ||
            typeof req.body.address === 'undefined' ||
            typeof req.body.token === 'undefined'   ||
            typeof req.body.gender === 'undefined'  ||
            typeof req.body.birthday === 'undefined' 
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

        const parts = req.body.birthday.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        var birthday = new Date(year, month - 1, day);

        body.birthday = birthday;

        Staff.findById(id)
        .then(data => {
            body.creater = data.code;
        })

        Staff.findOne({phoneNumber: req.body.phoneNumber})
        .then(async data => {
            if (data) {
                res.statusCode = 402;
                res.json({msg: "staff is existing"});
                return;
            }
            else {
                const count = parseInt(await Staff.countDocuments()) + 1;

                if (count < 9) {
                    body.code = `NV0${count}`;
                }
                else {
                    body.code = `NV${count}`;
                }

                const staff = new Staff(body);

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
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
            return;
        })
    }

    // [POST] /staff/update
    pUpdateStaff(req, res, next) {
        if (
            (typeof req.body.firstName === 'undefined' &&
            typeof req.body.lastName  === 'undefined' &&
            typeof req.body.phoneNumber === 'undefined' &&
            typeof req.body.shift === 'undefined' &&
            typeof req.body.salary === 'undefined' &&
            typeof req.body.address === 'undefined') ||
            (typeof req.body.id === 'undefined' &&
            typeof req.body.code === 'undefined' &&
            typeof req.body.phoneNumber === 'undefined')
        ) {
            res.statusCode =404; res.json({msg: "invalid data"});
            return;
        }

        if (req.body.id) {
            Staff.findByIdAndUpdate(req.body.id, req.body)
            .then(() => {
                res.statusCode =200; res.json({msg:"success"});
                return;
            })
            .catch(err => {
                res.statusCode =500; res.json({msg: err.message});
                return;
            });
        }
        else if (req.body.code) {
            Staff.updateOne({code: req.body.code}, req.body)
            .then(() => {
                res.statusCode =200; res.json({msg: "success"});
                return;
            })
            .catch(err => {
                res.statusCode =500; res.json({msg: err.message});
                return;
            });
        }
        else {
            Staff.updateOne({phoneNumber: req.body.phoneNumber})
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

    // [POST] /staff/search
    pSearchStaff(req, res, next) {
        if (typeof req.body.phoneNumber === 'undefined' && typeof req.body.code === 'undefined') {
            res.statusCode =404; res.json({msg: "invalid phone number"});
            return;
        }

        if (typeof req.body.code === 'undefined') {
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
        else {
            Staff.findOne({code: req.body.code})
            .then(data => {
                if (data) {
                    res.statusCode = 200;
                    res.json({msg: "success", data: data});
                    return;
                }
                else {
                    res.statusCode = 404;
                    res.json({msg: "code not found"})
                }
            })
        }
    }

    // [DELETE] /staff/delete
    pDeleteStaff(req, res, next) {
        if (typeof req.body.id === 'undefined' && typeof req.body.code === 'undefined' && typeof req.body.phoneNumber === 'undefined') {
            res.statusCode =404; res.json({msg: "invalid id"});
            return;
        }
        if (req.body.id){
            Staff.findByIdAndDelete(req.body.id)
            .then(() => {
                res.statusCode =200; res.json({msg: "success"});
                return;
            })
            .catch(err => {
                res.statusCode =500; res.json({msg: err.message});
                return;
            })
        }
        else if (req.body.code) {
            Staff.deleteOne({code: req.body.code})
            .then(() => {
                res.statusCode =200; res.json({msg: "success"});
                return;
            })
            .catch(err => {
                res.statusCode =500; res.json({msg: err.message});
                return;
            })
        }
        else {
            Staff.deleteOne({phoneNumber: req.body.phoneNumber})
            .then(() => {
                res.statusCode =200; res.json({msg: "success"});
                return;
            })
            .catch(err => {
                res.statusCode =500; res.json({msg: err.message});
            })
        }
    }

    //không xài
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
                Staff.updateOne({_id: req.params.id}, {salary: req.body.salary})
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
            } else {
                res.statusCode = 402;
                res.json({msg: "Not found"});             
                return;
            }         
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
        });
    }

    //không xài
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
            else {
                res.statusCode = 402;
                res.json({msg: "not found"});
            }

        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({msg: err.message});
        });
    }

    // [POST] /staff/ws/:id
    pGetWorkSchedule(req, res, next) {
        if (typeof req.body.month === 'undefined' ||
            typeof req.body.year === 'undefined') {
            res.statusCode = 404;
            res.json({msg: "invalid date"});
            return;
        }

        WS.find({staffId: req.params.id, date_month: req.params.month, date_year: req.params.year})
        .then((data) => {
            if (data) {
                res.statusCode = 200;
                res.json({msg: 'success', data, count: data.length    });
                return;
            } 
            res.statusCode = 402; 
            res.json({msg: 'not found'});
        })
        .catch((err) => {
            res.statusCode = 500;
            res.json({msg: err.message});
        })
        
    }

    // [POST] /staff/salary/get
    pGetSalary(req, res, next) {
        if (typeof req.body.month === 'undefined' ||
            typeof req.body.year === 'undefined' ||
            (typeof req.body.code === 'undefined' && req.body.phoneNumber === 'undefined')) {
                res.statusCode = 404;
                res.json({msg: "invalid date"});
                return;
        }

        if (req.body.code) {
            Staff.findOne({code: req.body.code})
            .then(async (data) => {
                if (data) 
                {
                    await WS.find({staffId: data._id.toString(), date_month: req.body.month, date_year: req.body.year})
                    .then(async (workSchedules) => {
                        let salary = (workSchedules.length + 1) * data.salary;
    
                        res.statusCode = 200;
                        res.json({msg: "success", ws: (workSchedules.length + 1), salary: salary})
                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.json({msg: err.message});
                    })
                }
                else {
                    res.statusCode = 402;
                    res.json({msg: "not found"});
                    return;
                }
            })       
            .catch(err => {
                res.statusCode = 500;
                res.json({msg: err.message});
            })     
        }
        else {
            Staff.findOne({phoneNumber: req.body.phoneNumber})
            .then(async (data) => {
                if (data) 
                {
                    await WS.find({staffId: data._id.toString(), date_month: req.body.month, date_year: req.body.year})
                    .then(async (workSchedules) => {
                        let salary = (workSchedules.length + 1)/30 * data.salary;
    
                        res.statusCode = 200;
                        res.json({msg: "success", ws: (workSchedules.length + 1), salary: salary})
                    })
                    .catch(err => {
                        res.statusCode = 500;
                        res.json({msg: err.message});
                    })
                }
                else {
                    res.statusCode = 402;
                    res.json({msg: "not found"});
                    return;
                }
            })       
            .catch(err => {
                res.statusCode = 500;
                res.json({msg: err.message});
            })   
        }
    }

    //[GET] /staff/getall
    gAllStaff(req, res, next) {
        Staff.find()
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "success", data: data});
            return;
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
            return;
        });
    }
}

module.exports = new StaffController();