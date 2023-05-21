const express = require('express');
const router = express.Router();

const SignInController = require('../app/controllers/UserController');

//[GET] /signin/verify/:token
router.get("/verify/:token", SignInController.gVerify)
//[POST] /signin
router.post('/', SignInController.pSignIn)

module.exports = router