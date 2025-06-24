const { createClient, createClientGoogle,changePassword, loginWithCredentials } = require('../services/userService');

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

const addClientGoogle = async (req, res) => {
    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const result = await createClientGoogle({ nombre, correo });
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

        const { id: clienteId, nombre, correo } = cliente;

        res.status(200).json({
        message: 'Login exitoso',
        cliente: { id: clienteId, nombre, correo }
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
    addClientGoogle,
    loginClient,
    changePass
};