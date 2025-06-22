const { loginWithAdminCredentials, getAllAdmins } = require('../services/adminService');

const getAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error al obtener admins:', error);
        res.status(500).send('Error al obtener admins');
    }
};

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

        const { id: adminId, nombre } = admin;

        res.status(200).json({
        message: 'Login exitoso',
        admin: { id: adminId, nombre }
        });
    } catch (error) {
        console.error('Error en login de admin:', error);
        res.status(500).json({ message: 'Error en el login del administrador' });
    }
};

module.exports = {
    getAdmins,
    loginAdmin
};
