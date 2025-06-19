const transporter = require('../config/mailConfig');

async function sendThankYouEmail(toEmail) {
    const mailOptions = {
        from: `"Golden Treasure" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Golden Treasure',
        text: 'Hola, gracias por escribirnos'
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendThankYouEmail
};