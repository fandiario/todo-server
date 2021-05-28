const crypto = require ("crypto")
require ("dotenv").config ()

function hashPassword (password) {
    const hmac = crypto.createHmac (process.env.HASH_METHODE, process.env.HASH_KEY)

    hmac.update (password)

    let result = hmac.digest ("hex")
    return result
}

module.exports = hashPassword