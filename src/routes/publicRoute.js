const express = require('express');
const router = express.Router();
const apiRoutes = require('../Services/service/publicService');

router.post('/signUp', apiRoutes.signUp);
router.post('/signIn', apiRoutes.signIn);
module.exports = router;
