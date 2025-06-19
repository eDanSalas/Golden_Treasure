const { sendThankYouEmail } = require('../services/mailService');

const sendMail = async (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ message: 'Falta el correo de destino' });
    }

    try {
        await sendThankYouEmail(to);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
};

module.exports = {
    sendMail
};