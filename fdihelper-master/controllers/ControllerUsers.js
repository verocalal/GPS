"use strict";

const mysql = require("mysql");
const config = require("../utils/config");
const pool = mysql.createPool(config.mysqlConfig);

// Gestiona la sesion de usuario
const session = require("express-session");
// Encriptado de contraseñas
const bcrypt = require("bcrypt");
// Conexión a la BBDD 
const modelUsers = require("../models/DAOUsers");
let oModelUsers = new modelUsers(pool);

// Iniciar sesión
function login(req, res, next) {

    let email = req.body.email
    oModelUsers.userLoginEncrypted(email, function (err, password) {
        if (err) {
            next(err)
        }
        else if (password !== null) {
            let actual_pass= req.body.password
            bcrypt.compare(actual_pass, password, function (err, result) {
                if (result) {
                    // Login correcto
                    req.session.currentUser = req.body.email
                    req.session.cookie.expires = false;
                    req.session.cookie.maxAge = 60 * 60 * 1000;
                    res.redirect("/forum")
                }
                else {
                    // Contraseña incorrecta
                    res.redirect("/")
                }
            })
        }
        else {
            // Error al coger la contraseña
            res.redirect("/")
        }
    })
}

// Cerrar sesión
function logout(req, res, next) {
    // Elimina las variables creadas para la sesion con los datos del usuario
    req.session.destroy();
    // Volvemos a la pagina inicial
    res.redirect("/");
}

// Registro usuario
function signup(req, res, next) {
    let data_user = {
        username: req.body.username,
        email: req.body.email,
        pass: req.body.password,
        type_user: (req.body.type_user === "OFF" ? 0 : 1),
        date_birth: req.body.date_birth,
        image: (req.file ? req.file.filename : null)
    }

    oModelUsers.signup(data_user, function (err, email) {
        if (err) {
            next(err)
        }
        else {
            res.redirect("/")
        }
    })    
}

// Actualizacion de datos del usuario
function updateUser(req, res, next) {

    // Primero de todo comprobamos si la contraseña metida es la correcta
    let actual_pass = req.body.password;

    if (actual_pass != null) {
        let email = res.locals.userEmail
        oModelUsers.userLoginEncrypted(email, function (err, password) {
            if (err) {
                next(err)
            }
            else {
                bcrypt.compare(actual_pass, password, function (err, result) {
                    if (result) {
                        // Pass correcto
                        let new_data_user = {
                            username: req.body.username,
                            date_birth: req.body.date_birth,
                            image: (req.file ? req.file.filename : null)
                        }
                        oModelUsers.updateUser(email, new_data_user, function (err, result) {

                            if (err) {
                                next(err)
                            }
                            else {
                                res.redirect("/")
                            }
                        })
                    }
                    else {
                        // Contraseña incorrecta
                        res.redirect("/")
                    }
                })
            }
        })        
    }else{
        // No se ingresó ninguna contraseña
        res.redirect("/")
    }
}

// Mostrar información de la cuenta
function profileInfo(req, res, next) {
    
    let email = res.locals.userEmail
    oModelUsers.getProfileInfo(email, function (err, user) {        
        if (err) {
            next(err)
        }
        else {
            // Asociaciones seguidas
            let currentUser = req.session.currentUser
            oModelUsers.getAssociations(currentUser, function(err, associations){
                if(err){
                    next(err)
                }
                else{
                    // Añadimos al usuario las asociaciones que sigue
                    user.associations = associations;
                    res.render("profile", { user: user })
                }
            })
        }
    })
}

// Se nombran las funciones de la forma que se llamarán desde su controlador correspondiente
module.exports = {
    login: login,
    logout: logout,
    signup: signup,
    updateUser: updateUser,
    profileInfo: profileInfo
};