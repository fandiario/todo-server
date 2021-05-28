const express = require ("express")
const Router = express.Router ()

const jwtVerify = require ("../middlewares/jwtVerify")
const userController = require ("../controllers/UserController")

Router.post ("/register", userController.onRegisterUser)
Router.post ("/login", userController.onLoginUser)

Router.post ("/get-data-user", jwtVerify, userController.getDataUserByToken)
Router.post ("/check-user-by-email", userController.onSearchUserByEmail)

Router.patch ("/edit-user", jwtVerify, userController.onEditUser)
Router.patch ("/forgot-password", userController.onForgotPassword)

module.exports = Router