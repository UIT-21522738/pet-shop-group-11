const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const WorkSchedule = require('../models/Work_schedule');

class UserController {
    //[POST] /signin
    // kiểm tra tài khoản mật khẩu đăng nhập
    pSignIn(req, res, next) 
    {
        if (
            typeof req.body.username === "undefined" ||
            typeof req.body.password === "undefined"
        ) {
            res.statusCode =402; res.json({ msg: "Invalid data"});
            return ;
        }

        const username = req.body.username
        const password = req.body.password

        User.findOne({username: username, password: password})
        .then(data => {
            if (data) 
            {
                const date = new Date(Date.now());
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();

                WorkSchedule.findOne({staffId: data._id, work_date: day, work_month: month, work_year: year})
                .then(async (ws) => {
                    if (ws) {
                        
                    } else {
                        const WS = new WorkSchedule({staffId: data._id, work_date: day, work_month: month, work_year: year});
                        await WS.save();
                    }
                })
                const token = jwt.sign({ _id: data._id }, 'petshop');
                res.statusCode =200; res.json({
                    msg: "success",
                    token: token,
                    user: {
                        username: data.username,
                        id: data._id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phoneNumber: data.phoneNumber,
                    }
                })
                return;
            }
            else {
                res.statusCode =402; res.json({msg: "Invalid username or password"})
                return;
            }
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
    }

    //[GET] // /signin/verify/:token
    // kiểm tra có phải đang đăng nhập hay không bằng cookie
    gVerify(req, res, next) {
        if (typeof req.params.token === 'undefined')  
        {
            res.statusCode = 402; res.json({msg: "invalid"});
            return;
        }
        const token = req.params.token;

        var id = ''
        // lấy id từ token
        try {id = jwt.verify(token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
        }
        
        User.findById(id)
        .then(data => {
            if (typeof data === 'undefined') {
                res.statusCode =402; res.json({msg: "Invalid"});
                return ;
            }

            res.statusCode =200; res.json({msg: "success", data: data._id});
            return;
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
        })
    }

    //[POST] /register
    pRegister(req, res, next) {
        if (
            typeof req.body.username    === 'undefined' ||
            typeof req.body.password    === 'undefined' ||
            typeof req.body.address     === 'undefined' ||
            typeof req.body.phoneNumber === 'undefined' ||
            typeof req.body.role        === 'undefined' ||
            typeof req.body.firstName   === 'undefined' ||
            typeof req.body.lastName    === 'undefined' ||
            typeof req.body.shift       === 'undefined' 
        ) {
            res.statusCode =402; res.json({msg: 'Invalid data'});
            return;
        }

        // kiểm tra username đã tồn tại hay chưa
        User.findOne({username: req.body.username})
        .then(data => {
            if (data) {
                res.statusCode = 404;
                res.json({msg: "username exist" })
                return ;
            }
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message})
        })

        //tạo user mới
        const newUser = new User(req.body)
        newUser.save()
        .then(() => {
            res.statusCode = 200;
            res.json({msg:"success"});
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({msg: err.message});
        });
    }
}

module.exports = new UserController();