const { sendUnlockEmail  } = require('../services/mailService');
const { obtenerClienteId } = require('../services/userService');

const sendMail = async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: 'ID requerido' });

    try {
        const cliente = await obtenerClienteId(id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        if (cliente.intentos < 3) {
            return res.status(400).json({ message: 'La cuenta no está bloqueada' });
        }

        await sendUnlockEmail(cliente.correo, cliente.nombre, cliente.id);

        res.status(200).json({ message: 'Correo enviado correctamente' });

    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ message: 'Error interno al enviar el correo' });
    }
};

module.exports = {
    sendMail
};