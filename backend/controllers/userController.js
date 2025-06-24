const { createReservation, createClient, changePassword } = require('../services/userService');

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
            id: result.id,
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
    const { id, contra } = req.body;

    if (!id || !contra) {
        return res.status(400).json({ message: 'Faltan ID o contraseña' });
    }

    try {
        const cliente = await loginWithCredentials(id, contra);
        if (!cliente) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const { id, nombre, correo } = cliente;

        res.status(200).json({
        message: 'Login exitoso',
        cliente: { id, nombre, correo }
        });
    } catch (error) {
        if (error.message === 'BLOCKED_ACCOUNT') {
            return res.status(501).json({ message: 'Cuenta bloqueada' });
        }
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el login' });
    }
};

const changePass = async (req, res) => {
    const { id, nombre, contra, nuevaContra } = req.body;
    
    try {
        const cliente = await changePassword(id, nombre, contra, nuevaContra);

        if (!cliente) {
            return res.status(401).json({ message: 'Error al cambiar contraseña' });
        }

        res.status(200).json({ message: 'Cambio de contraseña exitoso' });
    } catch (error) {
        if (error.message === 'SAME_PASSWORD') {
            return res.status(502).json({ message: 'La contraseña no puede ser igual al anterior' });
        }
        console.error('Error al cambiar contraseña de usuario:', error);
        res.status(500).json({ message: 'Error al cambiar contraseña de usuario' });
    }
}

module.exports = {
    addClient,
    addReservation,
    loginClient,
    changePass
};