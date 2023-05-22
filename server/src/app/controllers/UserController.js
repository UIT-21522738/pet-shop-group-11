const User = require('../models/Users');
const jwt = require('jsonwebtoken');

class UserController {
    //[POST] /signin
    // kiểm tra tài khoản mật khẩu đăng nhập
    pSignIn(req, res, next) 
    {
        if (
            typeof req.body.username === "undefined" ||
            typeof req.body.password === "undefined"
        ) {
            res.status(402).json({ msg: "Invalid data"});
            return ;
        }

        const username = req.body.username
        const password = req.body.password

        User.findOne({username: username, password: password})
        .then(data => {
            if (data) 
            {
                const token = jwt.sign({ _id: data._id }, 'petshop');
                res.status(200).json({
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
                res.status(402).json({msg: "Invalid username or password"})
                return;
            }
        })
        .catch(err => {
            res.status(500).json({msg: err.message});
            return;
        })
    }

    //[GET] // /signin/verify/:token
    // kiểm tra có phải đang đăng nhập hay không bằng cookie
    gVerify(req, res, next) {
        if (typeof req.params.token === 'undefined')  
        {
            req.status(402).json({msg: "invalid"});
            return;
        }
        const token = req.params.token;

        var id = ''
        // lấy id từ token
        try {id = jwt.verify(token, 'petshop')}
        catch (e) {
            res.status(500).json({msg: e.message});
        }
        
        User.findById(id)
        .then(data => {
            if (typeof data === 'undefined') {
                res.status(402).json({msg: "Invalid"});
                return ;
            }

            res.status(200).json({msg: "success"});
            return;
        })
        .catch(err => {
            res.status(500).json({msg: err.message});
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
            res.status(402).json({msg: 'Invalid data'});
            return;
        }

        // kiểm tra username đã tồn tại hay chưa
        User.findOne({username: req.body.username})
        .then(data => {
            if (typeof data !== 'undefined') {
                res.status(402).json({msg: "username exist"})
                return ;
            }
        })
        .catch(err => {
            res.status(500).json({msg: err.message})
        })

        //tạo user mới
        const newUser = new User(req.body)
        newUser.save()
        .then(() => {
            res.status(200).json({msg:"success"});
        })
        .catch(err => {
            res.status(500).json({msg: err.message});
        });
    }
}

module.exports = new UserController();