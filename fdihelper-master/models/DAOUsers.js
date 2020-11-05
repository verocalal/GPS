"use strict";
const modelAssociations = require("../models/DAOAssociations");
let oModelAssociations;
// DAO de Usuarios
class DAOUsers {
    constructor(pool) {
        this.pool = pool;
        oModelAssociations = new modelAssociations(pool);
    }
    // Inicio de sesión
    userLogin(email, pass, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else {// Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT email, username FROM users WHERE email = ? AND password = ?",
                    [email, pass], function (err, result) {
                        connection.release(); // Liberamos la conexion
                        if (err) {
                            callback(new Error("Error en la base de datos." + err))
                        }
                        else {
                            if (result.length > 0) {
                                callback(null, result[0].email) // Se devuelve el resultado
                            }
                            else {
                                callback(null, null)
                            }
                        }
                    }
                )
            }
        })
    }
    // Encriptación de la contraseña
    userLoginEncrypted(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT password FROM users WHERE email = ?",
                    [email], function (err, result) {
                        connection.release(); // Liberamos la conexion
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error en la base de datos." + err))
                        }
                        else {
                            if (result.length > 0) {
                                // Se devuelve el resultado
                                callback(null, result[0].password)
                            }
                            else {
                                callback(null, null)
                            }
                        }
                    }
                )
            }
        })
    }
    // Obtener datos del usuario
    getUser(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT * FROM users WHERE email = ?",
                    [email], function (err, result) {
                        connection.release(); // Liberamos la conexion
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error en la base de datos." + err))
                        }
                        else {
                            if (result.length > 0) {
                                let user = {
                                    username: result[0].username,
                                    email: result[0].email,
                                    date: result[0].date, 
                                    date_birth: result[0].date_birth,
                                    type_user:result[0].type_user,
                                    image: result[0].image
                                    
                                } // Se devuelve el resultado
                                callback(null, user)
                            }
                            else {
                                callback(null, null)
                            }
                        }
                    }
                )
            }
        })
    }
    // Registrar usuario
    signup(data_user, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT * FROM users WHERE email = ?;",
                [data_user.email],
                function(err, existe){
                    if(err){ // Si hay algún error se muestra un mensaje
                        callback(new Error("Error en la base de datos." + err));
                    }
                    else{
                        if(existe.length > 0){
                            // El usuario existe
                            callback(null, null)
                        }
                        else{
                            // El usuario no existe entonces se inserta
                            connection.query("INSERT INTO users (username, email, password, date_birth, image, type_user) VALUES (?,?,?,?,?,?);",
                            [data_user.username, data_user.email, data_user.pass, data_user.date_birth, data_user.image, data_user.type_user],
                            function (err, result) {
                                connection.release(); // Liberamos la conexion
                                if (err) {
                                    callback(new Error("Error en la base de datos." + err));
                                }
                                else {
                                    callback(null, result) // Se devuelve el resultado
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    // Modificar usuario
    updateUser(userEmail, new_data, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            } 
            else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    'UPDATE users SET username = ?, date_birth=?, image = ? WHERE email = ?',
                    [new_data.username, new_data.date_birth, new_data.image , userEmail],
                    function (err) {
                        connection.release(); // Se devuelve el resultado
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos " + err));
                        }
                        else {
                            callback(null);
                        }
                    }
                )
            }
        });
    }
    // Comprobación de la existencia de un usuario
    checkUser(email, pass, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT email FROM users WHERE email = ? AND password = ?",
                    [email, pass], function (err, result) {
                        connection.release(); // Se libera la conexion
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error en la base de datos." + err))
                        }
                        else { // Se devuelve el resultado
                            if (result.length > 0) { 
                                callback(null, true)
                            }
                            else {
                                callback(null, null)
                            }
                        }
                    }
                )
            }
        })
    }
    // Obtener perfil de usuario
    getProfileInfo(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {// Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM users WHERE email = ?;",
                    [email],
                    function (err, result) {
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos") + err);
                        }
                        else {
                            let user;
                            if (result.length > 0) {                                
                                user = {
                                    username: result[0].username,
                                    email: result[0].email,
                                    date: result[0].date,
                                    date_birth: (result[0].date_birth).getFullYear() + "-" + ('0' + (result[0].date_birth.getMonth()+1)).slice(-2) + "-" + ('0' + result[0].date_birth.getDate()).slice(-2),
                                    image: result[0].image,
                                    type_user: result[0].type_user
                                }
                            }// Se devuelve el resultado
                            callback(null, user);
                        }// Se libera la conexion
                        connection.release();
                    }
                );
            }
        });
    }
    // Obtener asociaciones seguidas por el usuario
    getAssociations(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else { // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(   "SELECT * FROM associations " +
                                    "LEFT JOIN join_association as j on id = j.associationId " + 
                                    "WHERE userMail = ?;",
                    [email], function (err, result) {
                        connection.release(); // Liberamos la conexion
                        if (err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error en la base de datos." + err))
                        }
                        else {
                            if (result.length > 0) {
                                let followedAssociations = []
                                let asso

                                for(let row of result){
                                    asso = {
                                        id : row.id,
                                        name : row.name,
                                        email : row.email,
                                        description : row.description,
                                        social_media : row.social_media,
                                        location : row.location,
                                        web : row.web,
                                        logo : row.logo,
                                    }
                                    followedAssociations.push(asso);
                                }
                                // Se devuelve el resultado
                                callback(null, followedAssociations)
                            }
                            else {
                                callback(null, null)
                            }
                        }
                    }
                )
            }
        })
    }
}
//Exportacion del modelo para pdoer usarlo luego en el controlador. 
module.exports = DAOUsers;