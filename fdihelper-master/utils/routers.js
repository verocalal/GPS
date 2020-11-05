
"use strict";
const path = require("path");
const express = require("express");
const multer = require("multer");


//Controladores
const ControllerForum = require('../controllers/ControllerForum');
const ControllerMeetings = require('../controllers/ControllerMeetings');
const ControllerAssociations = require('../controllers/ControllerAssociations');
const ControllerUsers = require('../controllers/ControllerUsers')


// MulterFactory para poder trabajar con file/s (archivos de imagen)
const multerFactory = multer({ dest: path.join("public", "images/associations_logos") });

const multerFactoryUsers = multer({ dest: path.join("public", "images/users_images") });
const routers = express.Router();

//Midleware checkuser 
//Funcion que se usa para ver el usuario conectado actualmente
const config = require("../utils/config");

const session = require("express-session");
const sessionMySQL = require("express-mysql-session");

const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelUsers = require("../models/DAOUsers");
let oModelUsers = new modelUsers(pool);

// Encriptado de contraseñas de usuarios
const bcrypt = require("bcrypt");
// Tiempo de encriptado (mayor numero, mayor seguridad)
var salt = 10;

function middlewareCheckUser(req, res, next) {
    if (req.session.currentUser != undefined) {
        oModelUsers.getUser(req.session.currentUser, function (err, user) {
            if (err) {
                res.redirect("/");
            } else {
                res.locals.userEmail = req.session.currentUser;
                res.locals.username = user.username;
                res.locals.image = user.image;
                res.locals.type_user = user.type_user;
                next();
            }
        });
    }
    else {
        // locals no deberia contener nada porque no hay usuario conectado
        next();
    }
}

// Middleware encriptado de contraseña
function middlewareEncrypt(req, res, next){
    bcrypt.hash(req.body.password, salt, (err,encrypted) => {
        req.body.password = encrypted;
        next();
    })
}

// Ruta index
routers.get("/", middlewareCheckUser, function mainPageForum(request, response, next) {
    response.status(200);
    response.render("index");
    //
});

//Users zone
//Rutas de usuario
routers.post("/users/login", middlewareCheckUser, ControllerUsers.login);
routers.get("/users/logout", ControllerUsers.logout);
routers.post("/users/signup", multerFactoryUsers.single("image"), middlewareEncrypt, ControllerUsers.signup);

routers.post("/users/update",multerFactoryUsers.single("image"),middlewareCheckUser, ControllerUsers.updateUser);

routers.get("/signup", function registerPage(request, response, next) {
    response.status(200);
    response.render("signup");
    //
});

routers.get("/users/profile", middlewareCheckUser, ControllerUsers.profileInfo);

// ----------------------- Rutas Foro

//Router de mostrar todos los temas
routers.get("/forum", middlewareCheckUser, ControllerForum.listTopics);
// Router para crear nuevo tema
routers.post('/forum/createTopic', ControllerForum.createTopic);
//Router de mostrar informacion de un tema
routers.post("/forum/topic", middlewareCheckUser, ControllerForum.topicInfo);
// Router para eliminar tema
routers.post('/forum/deleteTopic', ControllerForum.deleteTopic);
//Responder tema
routers.post('/forum/answerTopic', ControllerForum.answerTopic);
// Elimina una respuesta de un tema
routers.post('/forum/deleteAnswer', ControllerForum.deleteAnswer);
// Modifica los datos de un tema
routers.post('/forum/updateTopic', ControllerForum.updateTopic);

// ----------------------- Rutas Reuniones
routers.get("/meetings", middlewareCheckUser, ControllerMeetings.listMeetings);
routers.post("/meetings/createMeeting", ControllerMeetings.createMeeting);
routers.post("/meetings/info", middlewareCheckUser, ControllerMeetings.meetingInfo);
routers.post('/meetings/deleteMeeting', ControllerMeetings.deleteMeeting);
routers.post('/meetings/updateMeeting', ControllerMeetings.updateMeeting);
routers.post('/meetings/joinMeeting', ControllerMeetings.joinMeeting);
routers.post('/meetings/unjoinMeeting', ControllerMeetings.unjoinMeeting);

// routers.get('/meetings/joinMeeting', middlewareCheckUser, ControllerMeetings.joinMeeting); PRUEBA DE JOINMEETING 

// ----------------------- Rutas Asociaciones
routers.get("/listAssociations", middlewareCheckUser, ControllerAssociations.listAssociations);
routers.post("/associations/createAssociation", multerFactory.single("logo"), middlewareCheckUser, ControllerAssociations.createAssociation);
routers.post("/associations/info", middlewareCheckUser, ControllerAssociations.associationInfo);
routers.post("/associations/deleteAssociation", middlewareCheckUser, ControllerAssociations.deleteAssociation);
routers.post("/associations/joinAssociation", middlewareCheckUser, ControllerAssociations.joinAssociation);
routers.post("/associations/updateAssociation",multerFactory.single("logo"), middlewareCheckUser, ControllerAssociations.updateAssociation);

//Exportación de routers
module.exports = routers;