const { sendPayPalClientId } = require('../services/paypalService');

const obtenerCredencialesPaypal = async (req, res) => {
    try {
        const client_id = await sendPayPalClientId();
        if (!client_id) return res.status(400);
        res.status(200).json({ credencialClient: client_id });
    } catch (error) {
        console.error('Error al obtener credenciales', error);
        return res.status(500).json({ message: 'Error al obtener credenciales' });
    }
} 

module.exports =  {
    obtenerCredencialesPaypal
};