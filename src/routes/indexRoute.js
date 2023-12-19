const express = require('express');
const router = express.Router();


router.use('/user', require('./userRoute'))
router.use('/superAdmin', require('./superAdminRoute'))

module.exports = router