const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/mailController');
const { getAdmins, addReservation, addClient, loginClient } = require('../controllers/userController');

router.post('/mail', sendMail);
router.get('/admins', getAdmins);
router.post('/client', addClient);
router.post('/client/login', loginClient);
router.post('/reservation', addReservation);

module.exports = router;