function getPayPalClientId() {
    return process.env.CLIENT_ID;
}

module.exports = {
    getPayPalClientId
}