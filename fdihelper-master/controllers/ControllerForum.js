"use strict";

const mysql = require("mysql");
const config = require("../utils/config");
const pool = mysql.createPool(config.mysqlConfig);

// Conexión a la BBDD 
const modelForum = require("../models/DAOForum");
let oModelForum = new modelForum(pool);
const modelAnswer = require("../models/DAOAnswers");
let oModelAnswer = new modelAnswer(pool);

// Crear Tema
function createTopic(request, response, next) {
    oModelForum.create(request.body, function (err, foro) {
        if (err) {
            next(err);
        } else {
            response.status(200); // Indica que ha ido ok 
            // Se muestra la lista de temas
            response.redirect("/forum");
        }
    });
}

// Nuevo Tema
function newTopic(request, response, next) {
    response.status(200); // Indica que ha ido ok 
    // Se muestra la lista de temas
    response.render("createTopic");
}

// Eliminar tema
function deleteTopic(request, response, next) {
    oModelForum.delete(request.body, function (err, foro) {
        if (err) {
            next(err);
        } else {
            response.status(200); // Indica que ha ido ok 
            // Se muestra la lista de temas
            response.redirect("/forum");
        }
    });
}

// Listar temas
function listTopics(req, res, next) {
    oModelForum.getTopics(function (err, topics) {        
        if (err) {
            next(err);
        }
        else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la lista de temas
            res.render("listTopics", { topics: topics });
        }
    });
}

// Mostrar información del tema
function topicInfo(req, res, next) { // Aquí hay que llamar a oModelAnswer
    oModelForum.getTopicInfo(req.body.idTopic, function (err, topic) {        
        if (err) {
            next(err);
        }
        else {
            oModelAnswer.getAnswers(req.body.idTopic, function (err, answers) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200); // Indica que todo ha ido ok
                    // Se muestra la información relacionada con el tema
                    res.render("topic", { topic: topic, answers: answers });
                }
            });
        }
    });
}

// Responder a tema
function answerTopic(req, res, next) {
    oModelForum.answer(req.body, function (err, topics) {       
        if (err) {
            next(err);
        }
        else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la pagina de temas
            res.redirect("/forum");
        }
    });
}

// Eliminar respuesta de un tema
function deleteAnswer(req, res, next) {
    let idAnswer = req.body.idAnswer;
    oModelForum.deleteAns(idAnswer, function (err) {
        if (err) {
            next(err);
        }
        else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la pagina de temas
            res.redirect("/forum");
        }
    });
}

// Modificar datos del tema
function updateTopic(req, res, next) {
    let topic = {
        id: req.body.id,
        title: req.body.title,
        category: req.body.category,
        subcategory: req.body.subcategory,
        content: req.body.content
    }

    oModelForum.updateTopic(topic, function (err) {
        if (err) {
            next(err)
        }
        else {
            res.status(200); // Indica que todo ha ido ok
            // Muestra la pagina de temas
            res.redirect("/forum");
        }
    })
}

// Se nombran las funciones de la forma que se llamarán desde su controlador correspondiente
module.exports = {
    createTopic: createTopic,
    listTopics: listTopics,
    topicInfo: topicInfo,
    deleteTopic: deleteTopic,
    newTopic: newTopic,
    answerTopic: answerTopic,
    deleteAnswer: deleteAnswer,
    updateTopic: updateTopic
};
