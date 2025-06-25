const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/mailController');
const { addClient, loginClient, changePass, addClientGoogle } = require('../controllers/userController');
const { loginAdmin, getAdmins, changePassAdmin } = require('../controllers/adminController');
const { obtenerCredencialesPaypal } = require('../controllers/paypalController');
const { addReservation, obtenerTodas, obtenerReservacion, actualizar, eliminar } = require('../controllers/reservacionController');

// FireBase API REST
router.post('/reservaciones/crear', addReservation);
router.get('/reservaciones/todas', obtenerTodas);
router.get('/reservaciones/:id', obtenerReservacion);
router.put('/reservaciones/editar/:id', actualizar);
router.delete('/reservaciones/eliminar/:id', eliminar);

// Clientes FireBase API 
router.post('/client', addClient);
router.post('/client/login', loginClient);
router.post('/client/changepass', changePass);
router.post('/client/loginGoogle', addClientGoogle);

// Nodemailer API
router.post('/mail', sendMail);

// Admins FireBase API
router.get('/admins', getAdmins);
router.post('/admins/login', loginAdmin);
router.post('/admins/changepass', changePassAdmin);

// Paypal API
router.get('/cliente_paypal', obtenerCredencialesPaypal);

module.exports = router;