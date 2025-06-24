const transporter = require('../config/mailConfig');

async function sendUnlockEmail(toEmail, nombre, id) {
    const resetLink = `https://tusitio.com/restablecer?id=${encodeURIComponent(id)}`;

    const mailOptions = {
        from: `"Golden Treasure" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Solicitud de desbloqueo de cuenta',
        text: `Hola ${nombre},\n\nHemos detectado que tu cuenta fue bloqueada por intentos fallidos de inicio de sesión.

Para restablecer tu contraseña y desbloquear tu cuenta, haz clic en el siguiente enlace:\n\n${resetLink}\n\nSi tú no solicitaste esto, puedes ignorar el mensaje.

Saludos,\nGolden Treasure`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendUnlockEmail
};