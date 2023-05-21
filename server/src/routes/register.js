const express = require('express');
const router = express.Router();

const SignInController = require('../app/controllers/UserController');

//[POST] /register
router.post('/', SignInController.pRegister)

module.exports = router