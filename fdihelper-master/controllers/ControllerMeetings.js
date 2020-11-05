"use strict";

const mysql = require("mysql");
const config = require("../utils/config");
const pool = mysql.createPool(config.mysqlConfig);

// Conexión a la BBDD 
const modelMeetings= require("../models/DAOMeetings");
let oModelReunions= new modelMeetings(pool);

// Eliminar reunión
function deleteMeeting(request, response, next) {
    oModelReunions.delete(request.body, function (err) {        
        if (err) {
            next(err);
        } else {
            response.status(200); // Indica que ha ido ok 
            // Muestra la pagina reuniones
            response.redirect("/meetings");
        }  
    });
}

// Listar reuniones
function listMeetings(request, response, next) {
    oModelReunions.getMeetings(function (err, listMeetings) {
        if (err) {
            next(err);
        } else {
            response.status(200); // Indica que ha ido ok 
            // Muestra la pagina de reuniones
            response.render("listMeetings", { meetings: listMeetings });
        }
    });
}

// Mostrar información de la reunión
function meetingInfo(req, res, next) {
    oModelReunions.getMeetingInfo(req.body.idMeeting ,function (err, meetingInfo) {
        if (err) {
            next(err);
        } else {
            oModelReunions.countMembers(req.body.idMeeting, function (err, count){
                if(err){
                    next(err);
                }
                else{
                    res.status(200); // Indica que ha ido ok 
                    // Muestra la información de la reunión
                    meetingInfo.count=count;
                    console.log(meetingInfo.count);
                    res.render("meeting", { meetingInfo: meetingInfo });
                }
            });
        }
    });
}

// Crear una reunión
function createMeeting(req, res, next) {
    let datetime_meeting = req.body.date_reunion + ' ' + req.body.time_reunion;
    console.log(datetime_meeting);
    let meeting={
        user:req.body.user,
        title:req.body.title,
        subject:req.body.subject,
        comments:req.body.comments,
        datetime:datetime_meeting,
        capacity:req.body.capacity,
        location:req.body.location
    }
    
    oModelReunions.createMeeting(meeting, function(err){

        if (err) {
            next(err);
        } else {
            res.status(200); // Indica que ha ido ok 
            // Muestra la lista de reuniones
            res.redirect("/meetings");
        }
    })    
}

// Editar reunion
function updateMeeting(req, res, next) {
    let datetime_meeting = req.body.date_reunion + ' ' + req.body.time_reunion;

    let meeting={
        id:req.body.id,
        user:req.body.user,
        title:req.body.title,
        subject:req.body.subject,
        comments:req.body.comments,
        datetime:datetime_meeting,
        capacity:req.body.capacity,
        location:req.body.location
    }

    oModelReunions.updateMeeting(meeting, function(err){
        if (err) {
            next(err);
        } else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la lista de reuniones
            res.redirect("/meetings");
        }
    })    
}

// Unirse a una reunión
function joinMeeting(req, res, next) {
    let idMeeting = req.body.id
    let user = req.session.currentUser

    oModelReunions.joinMeeting(idMeeting, user, function(err, result){
        if (err) {
            next(err);
        } else {
            if(result){
                // Insercion correcta
                console.log("insertado")
            }
            else{
                // Superada la capacidad maxima de la reunion
                console.log("supera capacidad maxima o la reunion esta inactiva")
            }

            res.status(200); // Indica que todo ha ido ok
            res.redirect("/meetings");
        }
    })
}

// Desapuntarse de una reunión
function unjoinMeeting(req, res, next) {
    let idMeeting = req.body.id
    let userEmail = req.session.currentUser.userEmail

    oModelReunions.unjoinMeeting(idMeeting, userEmail, function(err){
        if (err) {
            next(err);
        } else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la pagina de runiones
            res.redirect("/meetings");
        }
    })
}

// Se nombran las funciones de la forma que se llamarán desde su controlador correspondiente
module.exports = {
    listMeetings: listMeetings,
    createMeeting: createMeeting,
    meetingInfo: meetingInfo,
    deleteMeeting: deleteMeeting,
    updateMeeting: updateMeeting,
    joinMeeting: joinMeeting,
    unjoinMeeting: unjoinMeeting
};


