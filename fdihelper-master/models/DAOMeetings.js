"use strict";
// DAO para reuniones
class DAOMeetings {
    constructor(pool) {
        this.pool = pool;
    }
    // Eliminar reunión
    delete(meetingsPost, callBack){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "DELETE FROM meetings WHERE id = ?",
                    [meetingsPost.id],
                    function (err,result) {
                        connection.release(); // Liberamos la conexion                        
                        if (err) { // Si hay algún error se muestra un mensaje
                            callBack(new Error("Error al eliminar reunión."), null);
                        } else {
                            // Se devuelve el resultado
                            callBack(null,result);
                        }
                    }
                );
            }
        });
    }
    // Obtener lista de reuniones
    getMeetings(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM meetings;",
                    function(err, result) {
                        if(err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos") + err);
                        }
                        else {
                            let meetings = [];
                            let top;

                            if(result.length > 0){
                                for(let row of result){
                                    var minutos=0;
                                    if ((row.datetime_meeting).getMinutes()<10) {
                                        minutos="0"+(row.datetime_meeting).getMinutes();
                                    } else {
                                        minutos=(row.datetime_meeting).getMinutes();
                                    }

                                    top = {
                                        id : row.id,
                                        user : row.user,
                                        title : row.title,
                                        subject : row.subject,
                                        comments : row.comments,
                                        capacity: row.capacity,
                                        location: row.location,
                                        state : row.state,
                                        datetime_meeting : (result[0].datetime_meeting).getFullYear() + "-" + ('0' + (result[0].datetime_meeting.getMonth()+1)).slice(-2) + "-" + ('0' + result[0].datetime_meeting.getDate()).slice(-2) + " " + (row.datetime_meeting).getHours() + ":" + minutos,
                                    }
                                    meetings.push(top);
                                }  
                            }
                            // Se devuelve el resultado
                            callback(null, meetings);
                        }
                        connection.release(); // Se libera la conexion
                    }
                );          
            }
        });
    }
    // Obtener información de una reunión
    getMeetingInfo(idMeeting, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM meetings WHERE id = ?;", 
                    [idMeeting],
                    function(err, result) {
                        if(err) { // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos") + err);
                        }
                        else {
                            let meeting;
                            if(result.length > 0){

                                var minutos=0;
                                if ((result[0].date).getMinutes()<10) {
                                    minutos="0"+(result[0].date).getMinutes();
                                } else {
                                    minutos=(result[0].date).getMinutes();
                                }
                                var minutos2=0;
                                if ((result[0].datetime_meeting).getMinutes()<10) {
                                    minutos2="0"+(result[0].datetime_meeting).getMinutes();
                                } else {
                                    minutos2=(result[0].datetime_meeting).getMinutes();
                                }                                

                                meeting = {
                                    id : result[0].id,
                                    user : result[0].user,
                                    title : result[0].title,
                                    subject : result[0].subject,
                                    comments : result[0].comments,
                                    capacity : result[0].capacity,
                                    location : result[0].location,
                                    state : result[0].state,
                                    date : (result[0].date).getFullYear() + "-" + ('0' + (result[0].date.getMonth()+1)).slice(-2) + "-" + ('0' + result[0].date.getDate()).slice(-2) + " " + (result[0].date).getHours() + ":" + minutos,
                                    date_meeting : (result[0].datetime_meeting).getFullYear() + "-" + ('0' + (result[0].datetime_meeting.getMonth()+1)).slice(-2) + "-" + ('0' + result[0].datetime_meeting.getDate()).slice(-2),
                                    time_meeting : (result[0].datetime_meeting).getHours() + ":" + minutos2
                                }
                            }
                            // Se devuelve el resultado
                            callback(null, meeting);
                        }
                        connection.release(); // Se libera la conexion
                    }
                );          
            }
        });
    }
    // Crear una reunión
    createMeeting(meeting, callBack){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."));
            }
            else{ // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "INSERT INTO meetings (user, title, subject, comments, capacity, location, datetime_meeting, state) VALUES (?,?,?,?,?,?,?, 'ACTIVO');",
                    [meeting.user, meeting.title, meeting.subject, meeting.comments, meeting.capacity, meeting.location, meeting.datetime],
                    function (err) {                        
                        connection.release(); // Liberamos la conexion                        
                        if (err) {// Si hay algún error se muestra un mensaje
                            callBack(new Error("Error al crear reunion."));
                        } else {
                            // Se devuelve el resultado
                            callBack(null);
                        }
                    }
                );
            }
        });
    }
    // Modificar asociación
    updateMeeting(meeting, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){// Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{// Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    'UPDATE meetings SET  title = ?, subject = ?, comments = ?, capacity = ?, location = ?, datetime_meeting = ? WHERE id = ?', 
                    [meeting.title, meeting.subject, meeting.comments, meeting.capacity, meeting.location, meeting.datetime, meeting.id],
                    function(err){
                        connection.release(); // Se libera la conexion
                        if(err) { // Si hay algún error se muestra un mensaje
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
    // Apuntarse a una reunión
    joinMeeting(meetingId, userMail, callback){
        this.pool.getConnection(function(err, connection){
            if(err){ // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{ // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT COUNT(*) AS count, capacity, state FROM meetings " + 
                    "LEFT JOIN join_meeting AS j ON id = j.id_meeting " +
                    "WHERE id = ?;",
                    [meetingId],
                    function(err, result){
                        if(err){ // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos " + err), null);
                        }
                        else{
                            connection.query("SELECT COUNT(*) AS count FROM join_meeting WHERE user = ? AND id_meeting = ?;",
                            [userMail, meetingId],
                            function(err, result2){
                                if(result2.length>0){
                                    if(result2[0].count<=0){
                                        if(result.length > 0){
                                            // En caso de que no se supere la capacidad maxima
                                            if(result[0].count < result[0].capacity && result[0].state == "ACTIVO"){
                                                connection.query(
                                                    'INSERT INTO join_meeting (id_meeting,user) VALUES (?,?);', 
                                                    [meetingId, userMail],
                                                    function(err){
                                                        connection.release();
                                                        if(err) {
                                                            callback(new Error("Error de acceso a la base de datos " + err));
                                                        }
                                                        else {// Se une a la reunión
                                                            callback(null, true);
                                                        }
                                                    }
                                                )
                                            }
                                            else{// No se une a la reunión
                                                callback(null, false)
                                            }
                                        }
                                        else{//no existe la reunion
                                            callback(null, null)
                                        }
                                    }
                                    else{//ya se encuentra el usuario inscrito
                                        callback(null, false)
                                    }
                                }
                                else{//no existe la reunion
                                    callback(null, null);
                                }
                            });
                        }
                    }
                )
            }
        });
    }

    // Desapuntarse de una reunión
    unjoinMeeting(meetingId, userMail, callback){
        this.pool.getConnection(function(err, connection){
            if(err){ // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{ // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "DELETE FROM join_meeting WHERE id_meeting = ? AND user = ?;",
                    [meetingId,userMail],
                    function(err, result){
                        if(err){ // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos " + err));
                        }
                        else{
                            callback(null)
                        }
                    }
                )
            }
        });
    }

    
    countMembers(meetingId, callback){
        this.pool.getConnection(function(err, connection){
            if(err){ // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{ // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT COUNT(*) AS count FROM join_meeting WHERE id_meeting = ?;",
                    [meetingId],
                    function(err, result){
                        if(err){ // Si hay algún error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos " + err));
                        }
                        else{
                            if(result.length>0){
                                callback(null, result[0].count)
                            }
                            else{
                                callback(null, null);
                            }
                        }
                    }
                )
            }
        });
    }
}
//Exportacion del modelo para pdoer usarlo luego en el controlador. 
module.exports = DAOMeetings;
