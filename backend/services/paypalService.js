const { getPayPalClientId } = require('../config/paypalConfig');

async function sendPayPalClientId() {
    return getPayPalClientId();
}

module.exports = {
    sendPayPalClientId
};