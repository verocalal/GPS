"use strict";

//-----------Modulos de node
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const express = require("express");

// Configuracion de la conezion a la BBDD y puerto de escucha del server
const config = require("./utils/config");

//------------Declaracion del router
const routers = require("./utils/routers");

// ------------Framework de express
const app = express();

//------------Gestion de session de usuario
const session = require("express-session");
const sessionMySQL = require("express-mysql-session");

const mysql = require("mysql");
const pool = mysql.createPool(config.mysqlConfig);
const modelUsers= require("./models/DAOUsers");
let oModelUsers= new modelUsers(pool);

const mysqlStore = sessionMySQL(session);
const sessionStore = new mysqlStore(config.mysqlConfig);
const middlewareSession = session({
    saveUninitialized : false,
    secret : "foobar34",
    resave : false,
    store : sessionStore
});
//  ---------  Motor de plantillas y localizacion de vistas.
//Segun las plantillas que vayamos a usar, este es para uso de ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//  --------- Gestion de sesion de usuario
app.use(middlewareSession);
//app.use(middlewareCheckUser); //No funciona con toda la pagina por lo que vamos a tener que exportarlo e introducirlo en las funciones que necesitemos comprobar que el usuario
//este conectado (esta funcion es la polla)

//  ---------  Parseador de parametros de HTML.
app.use(bodyParser.urlencoded({ extended: false }));

// -------- Aqui irá ya la cadena de middlewares suelen ser app.use....
app.use(morgan("dev")); 

// Vemos si se esta solicitando un recurso estatico, si es asi, lo devolvemos.
app.use(express.static(path.join(__dirname, 'public')));


// Enrutado 
app.use('/', routers);

// Middleware para el control del error 404 (recurso no encontrado).
app.use(function(request, response, next) {
    response.status(404);
    response.render("error404", { url: request.url });
});

// Middleware para el control del error 500 (error interno).
app.use(function(error, request, response, next) {
    response.status(500);
    response.render("error500", { message: error.message, pila: error.stack });
});

// Arranque del servidor
let server = app.listen(config.port, function(err) {
   if (err) {
        console.error(`No se pudo inicializar el servidor: ${err.message}`);
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
  
module.exports= {server};