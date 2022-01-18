const express = require('express');
const router = express.Router();

//Register, Login, Delete account
router.post('/register', require('./Register/register'));
router.post('/login', require('./Login/login'));

module.exports = router;
