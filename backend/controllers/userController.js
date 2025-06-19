const { getAllAdmins } = require('../services/userService');

const getAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error al obtener admins:', error);
        res.status(500).send('Error al obtener admins');
    }
};

module.exports = {
    getAdmins
};