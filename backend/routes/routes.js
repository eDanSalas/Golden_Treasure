const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/mailController');
const { addReservation, addClient, loginClient, changePass } = require('../controllers/userController');
const { loginAdmin, getAdmins, changePassAdmin } = require('../controllers/adminController');

router.post('/mail', sendMail);
router.post('/client', addClient);
router.get('/client/login', loginClient);
router.post('/reservation', addReservation);
router.post('/client/changepass', changePass);

//Admins
router.get('/admins', getAdmins);
router.post('/admins/login', loginAdmin);
router.post('/admins/changepass', changePassAdmin);

module.exports = router;