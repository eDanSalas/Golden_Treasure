const { loginWithAdminCredentials } = require('../services/adminService');

const loginAdmin = async (req, res) => {
    const { id, username, contra } = req.body;

    if (!id || !username || !contra) {
        return res.status(400).json({ message: 'Faltan id o usuario o contraseña' });
    }

    try {
        const admin = await loginWithAdminCredentials(id, username, contra);

        if (!admin) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const { id, nombre } = admin;

        res.status(200).json({
        message: 'Login exitoso',
        admin: { id, nombre }
        });
    } catch (error) {
        console.error('Error en login de admin:', error);
        res.status(500).json({ message: 'Error en el login del administrador' });
    }
};

module.exports = {
    loginAdmin
};
