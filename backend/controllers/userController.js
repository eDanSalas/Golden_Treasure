const { getAllAdmins, createReservation, createClient } = require('../services/userService');

const getAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error al obtener admins:', error);
        res.status(500).send('Error al obtener admins');
    }
};

const addClient = async (req, res) => {
    const { nombre, correo, contra } = req.body;

    if (!nombre || !correo || !contra) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const result = await createClient({ nombre, correo, contra });
        res.status(201).json({
        message: 'Cliente agregado correctamente',
        cliente: {
            ID: result.ID,
            nombre: result.nombre,
            correo: result.correo
        }
        });
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        res.status(500).json({ message: 'Error al agregar cliente' });
    }
};

const addReservation = async (req, res) => {
    const { numero_reservacion, nombre, correo, cantidad_personas } = req.body;

    if (!numero_reservacion || !nombre || !correo || !cantidad_personas) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const newUser = await createReservation({ numero_reservacion, nombre, correo, cantidad_personas });
        res.status(201).json({ message: 'Reservacion agregada correctamente', id: newUser.id });
    } catch (error) {
        if (error.message === 'DUPLICATE_RESERVATION') {
        return res.status(409).json({ message: 'Ya existe un usuario con ese número de reservación' });
        }

        console.error('Error al agregar usuario:', error);
        res.status(500).json({ message: 'Error al agregar usuario' });
    }
};

const loginClient = async (req, res) => {
    const { ID, contra } = req.body;

    if (!ID || !contra) {
        return res.status(400).json({ message: 'Faltan ID o contraseña' });
    }

    try {
        const cliente = await loginWithCredentials(ID, contra);
        if (!cliente) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const { ID, nombre, correo } = cliente;

        res.status(200).json({
        message: 'Login exitoso',
        cliente: { ID, nombre, correo }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el login' });
    }
};

module.exports = {
    getAdmins,
    addClient,
    addReservation,
    loginClient
};