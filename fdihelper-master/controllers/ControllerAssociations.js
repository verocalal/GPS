"use strict";

const mysql = require("mysql");
const config = require("../utils/config");
const pool = mysql.createPool(config.mysqlConfig);
const fs = require('fs'); // controlar ficheros
const path = require("path");

// Conexión a la BBDD 
const modelAssociations = require("../models/DAOAssociations");
let oModelAssociations = new modelAssociations(pool);

// Listado de asociaciones
function listAssociations(req, res, next) {
    oModelAssociations.getAssociations(function (err, associations) {
        if (err) {
            next(err);
        }
        else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la pagina de asociaciones
            res.render("listAssociations", { associations: associations });
        }
    });
}

// Mostrar Información de una Asociación
function associationInfo(req, res, next) {
    let idAssociation = req.body.idAssociation
    oModelAssociations.getAssociationInfo(idAssociation, function (err, association) {
        if (err) {
            next(err);
        }
        else {
            res.status(200); // Indican que todo ha ido ok
            //Muestra la pagina de una asociación
            res.render("association", { association: association });
        }
    });
}

// Dar de alta una asociación
function createAssociation(req, res, next) {

    let association = {
        name: req.body.name.toUpperCase(),
        email: req.session.currentUser,
        description: req.body.description,
        social_media: req.body.social_media,
        location: req.body.location,
        web: req.body.web,
        logo: (req.file ? req.file.filename : null)
    }

    oModelAssociations.createAssociation(association, function (err, idAssociation) {

        if (err) {
            next(err);
        } else {
            res.status(200);
            if (idAssociation >0){ // Deberiamos marcar un mensaje de Correcto
                res.redirect("/listAssociations?succes=true");
            }
            else{ // Deberiamos poner Mensaje de error
                res.redirect("/listAssociations");
            }
           
        }
    })
}

// Dar de baja una asociacion
function deleteAssociation(request, response, next) {
    let idAssociation = request.body.id
    oModelAssociations.deleteAssociation(idAssociation, function (err, logo) {
        if (err) {
            next(err);
        } else {
            // Eliminamos el archivo logo del servidor
            if (logo != null)
                fs.unlinkSync(path.join("public", "images/associations_logos/" + logo));

            response.status(200); // Indica que ha ido ok
            // Muestra la lista de asociaciones 
            response.redirect("/listAssociations");
        }
    });
}

// Seguir asociación
function joinAssociation(request, response, next) {
    let idAssociation = request.body.id
    let user = request.session.currentUser
    oModelAssociations.joinAssociation(idAssociation, user, function (err, res) {
        if (err) {
            next(err);
        } else {

            response.status(200); // Indica que ha ido ok 
            if(res == true ){
                // deberia marcar mensaje de que se ha seguido OK
                response.redirect("/listAssociations");
            }
            else{
                // deberia marcar mensaje de "Ya sigue a la asociacion"
                response.redirect("/listAssociations");
            }

        }
    });
}

function updateAssociation(req, res, next) {


    let old_logo = req.body.associationLogo
    
    let association = {
        id: req.body.associationId,
        name: req.body.name === "" ? req.body.associationName : req.body.name,
        description: req.body.description ==="" ? req.body.associationDescription: req.body.description,
        social_media: req.body.social_media ==="" ? req.body.associationSocialMedia : req.body.social_media,
        location: req.body.location ===""? req.body.associationLocation : req.body.location,
        web: req.body.web ==="" ? req.body.associationWeb : req.body.web,
        logo: (req.file ? req.file.filename : old_logo)
    }

    // si hemos cambiado de imagen, borramos la anterior
    if(association.logo !== old_logo && old_logo !=""){
        fs.unlinkSync(path.join("public", "/images/associations_logos/" + old_logo));

    }
    console.log(association);
    oModelAssociations.updateAssociation(association, function (err) {
        if (err) {
            next(err);
        } else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la lista de reuniones
            res.redirect("/listAssociations");
        }
    })
}

// Se nombran las funciones de la forma que se llamarán desde su controlador correspondiente
module.exports = {
    associationInfo: associationInfo,
    listAssociations: listAssociations,
    createAssociation: createAssociation,
    deleteAssociation: deleteAssociation,
    joinAssociation: joinAssociation,
    updateAssociation: updateAssociation
};