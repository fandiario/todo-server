const validator = require ("validator")
const jwt = require ("jsonwebtoken")
require ("dotenv").config()

const db = require ("../connection/Connection")
const hashPassword = require ("../helpers/Hash")

// Register

const onRegisterUser = (req, res) => {
    try {
        const data = req.body
        let uidUser = Date.now ()

        if (!data.email || !data.password) throw ({message: "You have to fill email and password to register."})
        if (!(validator.isEmail (data.email))) throw ({message: "Invalid email format"})
        if (data.password.length < 6) throw ({message: "Password's min length is 6 characters"})

        try {
            const hashPasswordResult = hashPassword (data.password)
            data.password = hashPasswordResult

            // Check if email already exist
            let queryCheck = `SELECT * FROM users WHERE email = '${data.email}'`
            db.query (queryCheck, (err, result) => {
                try {
                    if (err) throw err

                    if (result.length === 0) {

                        // JWT sign
                        jwt.sign ({uid: uidUser}, process.env.JWT_KEY, (err, token) => {
                            try {
                                if (err) throw err

                                // Insert Data
                                let dataToSend = {
                                    email: data.email,
                                    password: data.password,
                                    uid: uidUser
                                }

                                let queryInsert = `INSERT INTO users SET ?`
                                db.query (queryInsert, dataToSend, (err, result) => {
                                    try {
                                        if (err) throw err

                                        res.status (200).send ({
                                            error: false,
                                            id: result.insertId,
                                            uid: uidUser,
                                            email: data.email,
                                            token: token,
                                            message: "User registration is success."
                                        })
                                        
                                    } catch (error) {
                                        console.log (error)
                                        res.status (500).send ({
                                            error: true, 
                                            message: error.message
                                        }) 
                                    }
                                })

                            } catch (error) {
                                console.log (error)
                                res.status(500).send ({
                                    error: true,
                                    message: "Error jwtToken Generator"
                                })
                            }
                        })
                        
                        

                    } else {
                        res.status (200).send ({
                            error: true,
                            message: "This email has been registered."
                        })
                    }
                    
                } catch (error) {
                    console.log (error)
                    res.status (500).send ({
                        error: true, 
                        message: error.message
                    })  
                }
            })


        } catch (error) {
            console.log (error)
            res.status (500).send ({
                error: true, 
                message: "Internal server error"
            })   
        }
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const onLoginUser = (req, res) => {
    try {
        let data = req.body

        if (!data.email || !data.password) throw ({message: "Unidentified email or password."})

        let queryCheck = `SELECT * FROM users WHERE email = '${data.email}'`
        db.query (queryCheck, (err, result) => {
            try {
                if (err) throw err

                if (result.length === 1) {

                    const hashPasswordResult = hashPassword (data.password)
                    data.password = hashPasswordResult
                    
                    if (result[0].email === data.email && result[0].password === data.password) {
                        // JWT sign
                        jwt.sign ({uid: result[0].uid}, process.env.JWT_KEY, (err, token) => {
                            try {
                                if (err) throw err

                                res.status (200).send ({
                                    error: false,
                                    id: result[0].id,
                                    uid: result[0].uid,
                                    email: result[0].email,
                                    token: token
                                })


                            } catch (error) {
                                console.log (error)
                                res.status(500).send ({
                                    error: true,
                                    message: "Error jwtToken Generator"
                                })
                            }
                        })

                    } else {
                        res.status (200).send ({
                            error: true,
                            message: "Unidentified email or password"
                        })
                    }

                } else {
                    res.status (200).send ({
                        error: true,
                        message: "Unidentified email or password"
                    })
                }
                
            } catch (error) {
                console.log (error)
                res.status(500).send ({
                    error: true,
                    message: error.message
                })
            }
        })

        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

// Read
const getAllUser = (req, res) => {
    let queryGet = `SELECT * FROM users`

    db.query (queryGet, (err, result) => {
        try {
            if (err) throw err

            res.status (200).send ({
                error: false,
                data: result
            })
            
        } catch (error) {
            console.log (error)
                res.status(500).send ({
                    error: true,
                    message: error.message
                })
        }
    })
}



const getDataUserByToken = (req, res) => {
    let dataToken = req.dataToken

    let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
    db.query (querySearch, (err, result) => {
        try {
            if (err) throw err

            if (result.length === 1) {
                res.status (200).send ({
                    error: false,
                    id: result[0].id,
                    email: result[0].email,
                    uid: result[0].uid
                })


            } else {
                res.status(200).send ({
                    error: true,
                    message: "Unknwon user or unregistered email account"
                })
            }
            
        } catch (error) {
            console.log (error)
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const onSearchUserByEmail = (req, res) => {
    try {
        let data = req.body

        if (!data.email) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE email = '${data.email}'`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                if (result.length === 1) {
                    res.status (200).send ({
                        error: false,
                        id: result[0].id,
                        uid: result[0].uid,
                        email: result[0].email
                    }) 


                } else {
                    res.status (200).send ({
                        error: true,
                        message: "Unknwon or unregistered email address."
                    })
                }
                
            } catch (error) {
                console.log (error)
                res.status(500).send ({
                    error: true,
                    message: error.message
                })
            }
        })

    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const onEditUser = (req, res) => {
    try {
        const data = req.body
        const dataToken = req.dataToken

        if (!data.email || !data.password) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                const hashPasswordResult = hashPassword (data.password)
                data.password = hashPasswordResult

                let dataToSend = {
                    email: data.email,
                    password: data.password
                }

                let queryEdit = `UPDATE users SET ? WHERE uid = ?`
                db.query (queryEdit, [dataToSend, dataToken.uid], (err, result1) => {
                    try {
                        if (err) throw err

                        res.status (200).send ({
                            error: false,
                            id: result[0].id,
                            email: data.email,
                            // password: data.password,
                            message: "Data has been edited successfully."
                        })
                        
                    } catch (error) {
                        console.log (error)
                        res.status(500).send ({
                            error: true,
                            message: error.message
                        }) 
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status(500).send ({
                    error: true,
                    message: error.message
                }) 
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}


const onForgotPassword = (req, res) => {
    try {
        const data = req.body
        // const dataParams = req.params

        // console.log (dataParams)
        if (!data.password || !data.email) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE email = '${data.email}'`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                const hashPasswordResult = hashPassword (data.password)
                data.password = hashPasswordResult

                if (result.length === 1) {
                    let dataToSend = {
                        email: data.email,
                        password: data.password
                    }

                    let queryEdit = `UPDATE users SET ? WHERE email = '${data.email}'`
                    db.query (queryEdit, dataToSend, (err, result1) => {
                        try {
                            if (err) throw err

                            res.status (200).send ({
                                error: false,
                                id: result[0].id,
                                email: data.email,
                                message: "Password has been updated."
                            })
                            
                        } catch (error) {
                            console.log (error)
                            res.status(500).send ({
                                error: true,
                                message: error.message
                            }) 
                        }
                    })

                } else {
                    res.status (200).send ({
                        error: true,
                        message: "Unknown email account."
                    })
                }

            } catch (error) {
                console.log (error)
                res.status(500).send ({
                    error: true,
                    message: error.message
                }) 
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}


module.exports = {
    onRegisterUser,
    onLoginUser,
    getAllUser,
    getDataUserByToken,
    onSearchUserByEmail,
    onEditUser,
    onForgotPassword
}

