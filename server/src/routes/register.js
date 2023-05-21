const express = require('express');
const router = express.Router();

const SignUpController = require('../app/controllers/UserController');

//[POST] /register
router.post('/', SignUpController.pRegister)

module.exports = router