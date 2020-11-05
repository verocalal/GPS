"use strict";
// DAO para respuestas a tema
class DAOAnswers {
    constructor(pool) {
        this.pool = pool;
    }
    // Contenido de las respuestas 
    getAnswers(idAnswer, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM `answers` WHERE id_topic = ?", 
                    [idAnswer],
                    function(err, result) {
                        if(err) {
                            // Si hay algun error se muestra un mensaje
                            callback(new Error("Error de acceso a la base de datos") + err);
                        }
                        else {
                            // Todo va bien, se continua el proceso
                            let answers = [];
                            let answer;

                            if(result.length > 0){

                                for(let row of result){
                                    var minutos=0;

                                    if ((row.date).getMinutes()<10) {
                                        minutos="0"+(row.date).getMinutes();
                                    } else {
                                        minutos=(row.date).getMinutes();
                                    }

                                    answer = {
                                        id : row.id,
                                        idTopic: row.id_topic,
                                        user: row.user,
                                        content: row.content,
                                        date : (row.date).getFullYear() + "-" + ((row.date).getMonth() + 1) + "-" + (row.date).getDate() + " " + (row.date).getHours() + ":" + minutos
                                    }
                                    answers.push(answer);
                                }                                    
                            }
                            // Resultado de la consulta
                            callback(null, answers);
                        }
                        connection.release();
                    }
                );          
            }
        });
    }
}
module.exports = DAOAnswers;