const jwt = require ("jsonwebtoken")
require ("dotenv").config ()

const jwtVerify = (req, res, next) => {
    const data = req.body
    const token = data.token

    if (!token) return res.status(406).send ({
        error: true,
        message: "Token is not found."
    })

    jwt.verify (token, process.env.JWT_KEY, (err, dataToken) => {
        try {
            if (err) throw err

            req.dataToken = dataToken
            next ()
            
        } catch (error) {
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })


}

module.exports = jwtVerify