const mysql = require("mysql");
const config = require("../utils/config");
const pool = mysql.createPool(config.mysqlConfig);
const entitiesToImport= require("./SQLPopulate");
const daoForoConstructor = require('../models/DAOForum');
const daoReunionesConstructor = require('../models/DAOMeetings');
const daoAsociacionesConstructor = require('../models/DAOAssociations'); 
const daoUsersConstructor = require('../models/DAOUsers'); 
const DAOForumTests = new daoForoConstructor(pool);
const DAOMeetingsTests = new daoReunionesConstructor(pool);
const DAOAssociationsTests = new daoAsociacionesConstructor(pool);
const DAOUsersTests = new daoUsersConstructor(pool);
const app = require('../app');
const serverhttp = app.server;

module.exports = {

    serverhttp,
    DAOForumTests,
    DAOMeetingsTests,
    DAOAssociationsTests,
    DAOUsersTests,

    terminateConnection(callBack){
        
        pool.end((err)=>{
            if(err) callBack(err);
            else callBack(null);
        })
    },

    populateDatabaseTopics( topic, callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                    connection.query(
                        "INSERT INTO topics (title, content, category, subcategory, user) VALUES (?,?,?,?,?);",
                        [topic.title,topic.content, topic.category, topic.subcategory, topic.user],
                        function (err, resp) {
                            connection.release();
                            if (err) {                                
                                callBack(err, null);
                            } 
                            else{                    
                            callBack(null,resp);  
                            }
                        }   
                    );            
            }

        });
    },
    populateDatabaseAnswers(answer, callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                connection.query(
                    "INSERT INTO answers (id_topic, user, content) VALUES (?,?,?);",
                    [answer.id_topic,answer.user, answer.content],

                    function (err, resp) {
                        connection.release();
                        if (err) {                  
                            callBack(err, null);
                        }
                        else{
                            callBack(null, resp )
                        }
                    }
                );
            }
        });
    },

    emptyDatabaseAnswers(callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                connection.query(
                    "DELETE FROM answers", 
                    function (err, resp) { 
                        connection.release();                      
                        if (err) {                            
                            callBack(err, null);
                        }
                        else{
                            callBack(null, null);
                        }
                    });    
            }
        });
    },
    emptyDatabaseTopics(callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                connection.query(
                    "DELETE FROM topics",
                    null,    
                    function (err, resp) { 
                        connection.release();                      
                        if (err) {                            
                            callBack(err, null);
                        }
                        else{
                            callBack(null, null);
                        }
                    }
                );     
            }
        });
    },

    populateDatabaseMeetings(meeting, callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                    connection.query(
                        "INSERT INTO meetings (user, title, subject, datetime_meeting, comments, capacity, location, state) VALUES (?,?,?,?,?,?,?,?);",
                        [meeting.user,meeting.title, meeting.subject, meeting.datetime, meeting.comments, meeting.capacity, meeting.location,  meeting.state],
    
                        function (err, resp) {
                            connection.release();
                            if (err) {        
                                callBack(err, null);
                            }
                            else{
                                callBack(null, resp);
                            }
                        }
                    ); 
            }
        });
    },

    emptyDatabaseMeetings( callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                connection.query(
                    "DELETE FROM meetings",    
                    function (err, resp) {  
                        connection.release();                   
                        if (err) {                              
                            callBack(err, null);
                        }
                        else{
                            callBack(null, null);
                        }
                    }
                );                        
            }
        });
    },

    populateDatabaseAssociations(association, callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                 connection.query(
                    "INSERT INTO associations (name,email,description,social_media,location,web,logo) VALUES (?,?,?,?,?,?,?);",
                    [association.name,association.email, association.description, association.social_media, association.location, association.web,association.logo],    
                    function (err, resp) {
                        connection.release();
                        if (err) {                               
                            callBack(err, null);
                        }
                        else{
                            callBack(null,resp);
                        }    
                    }
                ); 
            }
        });
    },

    emptyDatabaseAssociations( callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                connection.query(
                    "DELETE FROM associations",    
                    function (err, resp) {  
                        connection.release();                   
                        if (err) {                              
                            callBack(err, null);
                        }
                        else{
                            callBack(null, null);
                        }
                    }
                );       
            }
        });
    },

    populateDatabaseUsers(user, callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                 connection.query(
                    "INSERT INTO users (username,email,password,date_birth, type_user) VALUES (?,?,?,?,?);",
                    [user.name,user.email, user.password,user.date_birth,user.type_user],
    
                    function (err, resp) {
                        connection.release();
                        if (err) {                               
                            callBack(err, null);
                        }
                        else{
                            callBack(null,resp);
                        }    
                    }
                ); 
            }
        });
    },

    emptyDatabaseUsers( callBack){
        pool.getConnection(function (err, connection) {
            if (err) {
                callBack(err, null);
            }
            else{
                connection.query(
                    "DELETE FROM users",    
                    function (err, resp) {  
                        connection.release();                   
                        if (err) {                              
                            callBack(err, null);
                        }
                        else{
                            callBack(null, null);
                        }
                    }
                );       
            }
        });
    },
}