const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/mailController');
const { addReservation, addClient, loginClient } = require('../controllers/userController');
const { loginAdmin, getAdmins } = require('../controllers/adminController');

router.post('/mail', sendMail);
router.post('/client', addClient);
router.get('/client/login', loginClient);
router.post('/reservation', addReservation);

//Admins
router.get('/admins', getAdmins);
router.get('/admins/login', loginAdmin);

module.exports = router;