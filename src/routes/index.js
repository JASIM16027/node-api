const express = require('express');
const router = express.Router();
const publicRoute = require('./publicRoute');
const userRoute = require('./userRoute');

router.use('',publicRoute)
router.use('/users',userRoute)
module.exports = router