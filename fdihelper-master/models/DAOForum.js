"use strict";
// DAO para foro
class DAOForum {
    constructor(pool) {
        this.pool = pool;
    }
    //Contenido del foro
    search(forumPost, callBack){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM foro WHERE name = ?",
                    [forumPost],
                    function (err, result) {                        
                        connection.release(); // Liberamos la conexion                        
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callBack(new Error("Error al buscar el foro."), null);
                        } else {
                            // Devuelve el resultado
                            callBack(null,result[0]);
                        }
                    }
                );
            }

        });
    }

    // Ingresar los datos para crear un tema
    create(forumPost, callBack){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "INSERT INTO topics (title, content, category, subcategory, user) VALUES (?,?,?,?,?);",
                    [forumPost.title,forumPost.content, forumPost.category, forumPost.subcategory, forumPost.user],
                    function (err,result) {
                        connection.release(); // Liberamos la conexion                        
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callBack(new Error("Error al crear tema."), null);
                        } else {
                            // devuelve el resultado
                            callBack(null,result);
                        }
                    }
                );
            }

        });
    }
    // Eliminar un tema
    delete(forumPost, callBack){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "DELETE FROM topics WHERE id = ?",
                    [forumPost.id],
                    function (err,result) {                        
                        connection.release(); // Liberamos la conexion
                        if (err) {
                            // Si hay algún error se muestra un mensaje
                            callBack(new Error("Error al eliminar tema."), null);
                        } else {
                            // Se devuelve el resultado
                            callBack(null,result);
                        }
                    }
                );
            }
        });
    }
    // Obtener lista de temas
    getTopics(callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM topics;",
                    function(err, result) {
                        // Si hay algún error se muestra un mensaje
                        if(err) {
                            callback(new Error("Error de acceso a la base de datos") + err);
                        }
                        else {
                            let topics = [];
                            let top;

                            if(result.length > 0){
                                for(let row of result){

                                    var minutos=0;
                                    if ((row.date).getMinutes()<10) {
                                        minutos="0"+(row.date).getMinutes();
                                    } else {
                                        minutos=(row.date).getMinutes();
                                    }

                                    top = {
                                        id : row.id,
                                        user : row.user,
                                        title : row.title,
                                        category : row.category,
                                        subcategory : row.subcategory,
                                        date : (row.date).getFullYear() + "-" + ((row.date).getMonth() + 1) + "-" + (row.date).getDate() + " " + (row.date).getHours() + ":" + minutos
                                    }
                                    topics.push(top);
                                }  
                            }
                            // Se devuelve el resultado
                            callback(null, topics);
                        }
                        connection.release();
                    }
                );          
            }
        });
    }
    // Obtener información de un tema
    getTopicInfo(idTopic, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM `topics` WHERE id = ?", 
                    [idTopic],
                    function(err, result) {
                        // Si hay algún error se muestra un mensaje
                        if(err) {
                            callback(new Error("Error de acceso a la base de datos") + err);
                        }
                        else {
                            let topic;
                            if(result.length > 0){

                                var minutos=0;
                                if ((result[0].date).getMinutes()<10) {
                                    minutos="0"+(result[0].date).getMinutes();
                                } else {
                                    minutos=(result[0].date).getMinutes();
                                }
                                topic = {
                                    id : result[0].id,
                                    user : result[0].user,
                                    title : result[0].title,
                                    category : result[0].category,
                                    subcategory : result[0].subcategory,
                                    content : result[0].content,
                                    date : (result[0].date).getFullYear() + "-" + ((result[0].date).getMonth() + 1) + "-" + (result[0].date).getDate() + " " + (result[0].date).getHours() + ":" + minutos,
                                }
                            }
                            // Se devuelve el resultado
                            callback(null, topic);
                        }
                        connection.release(); // Liberamos la conexion
                    }
                );          
            }
        });
    }
    // Ingresar respuesta a un tema
    answer(forumPost, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos."), null);
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query( // insertar el contenido de la respuesta con el id del tema que tenga en topics 
                    "INSERT INTO answers (id_topic, user, content) VALUES ((SELECT id from `topics` where topics.id= ?),?,?);",
                    [forumPost.id,forumPost.user, forumPost.answer], //ojo, este user es otro diferente al que creó el tema
                    function (err,result) {
                        connection.release(); // Liberamos la conexion                        
                        if (err) {
                            // Si hay algún error se muestra un mensaje
                            callback(new Error("Error al responder al tema."), null);
                        } else {
                            // Devuelve el resultado
                            callback(null,result);
                        }
                    }
                );
            }

        });
    }
    // Eliminar respuesta
    deleteAns(answerId, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos."));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "DELETE FROM answers WHERE id = ?;",
                    [answerId],
                    function (err,result) {
                        connection.release(); // Liberamos la conexion
                        if (err) {
                            // Si hay algún error se muestra un mensaje
                            callback(new Error("Error al responder al tema."));
                        } else {
                            // Se elimina la respuesta
                            callback(null);
                        }
                    }
                );
            }

        });
    }
    //Editar tema
    updateTopic(topic, callback) {
        this.pool.getConnection(function(err, connection){
            if(err){
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    'UPDATE topics SET title = ?, category = ?, subcategory = ?, content = ? WHERE id = ?', 
                    [topic.title, topic.category, topic.subcategory, topic.content, topic.id],
                    function(err){
                        connection.release(); // Liberamos la conexion
                        if(err) {
                            // Si hay algún error se muestra un mensaje
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
}

//Exportacion del modelo para pdoer usarlo luego en el controlador. 
module.exports = DAOForum;
