const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/mailController');
const { getAdmins } = require('../controllers/userController');

router.post('/mail', sendMail);
router.get('/admins', getAdmins);

module.exports = router;