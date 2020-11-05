"use strict";
// DAO para Asociaciones
class DAOAssociations {
    constructor(pool) {
        this.pool = pool;
    }
    // Obtener contenido de una asociación 
    // @param idAssociation : idAsociación que deseamos coger la información
    // @return obj association: objeto asociacion con todos sus atributos
    getAssociationInfo(idAssociation, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query(
                    // Si la conexión a la BBDD tiene éxito se hace la consulta
                    "SELECT * FROM associations WHERE id = ?;",
                    [idAssociation],
                    function (err, result) {
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callback(new Error("Error de consulta: getAssociationInfo") + err);
                        }
                        else {
                            // Todo va bien, se continua el proceso
                            let association;

                            if (result.length > 0) {
                                association = {
                                    id: result[0].id,
                                    name: result[0].name,
                                    email: result[0].email,
                                    description: result[0].description,
                                    social_media: result[0].social_media,
                                    location: result[0].location,
                                    web: result[0].web,
                                    logo: result[0].logo
                                }
                            }
                            // Resultado de la consulta
                            callback(null, association);
                        }
                        connection.release(); // Se libera la conexión
                    }
                );
            }
        });
    }
    // Obtener las asociaciones creadas
    // @param none 
    // @return array de objtetos de asociacion
    getAssociations(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "SELECT * FROM associations;",
                    function (err, result) {
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callback(new Error("Error de consulta: getAssociations") + err);
                        }
                        else {
                            // Todo va bien, se continua el proceso
                            let associations = [];
                            let asso;

                            if (result.length > 0) {
                                for (let row of result) {
                                    asso = {
                                        id: row.id,
                                        name: row.name,
                                        email: row.email,
                                        description: row.description,
                                        social_media: row.social_media,
                                        location: row.location,
                                        web: row.web,
                                        logo: row.logo
                                    }
                                    associations.push(asso);
                                }
                            }
                            // Resultado de la consulta
                            callback(null, associations);
                        }
                        connection.release(); //Se libera la conexión
                    }
                );
            }
        });
    }
    // Ingresar los datos para crear una asociación
    // @param association : objeto asociacion con los datos a cargar en la bbdd
    // @return id : id de la asociacion nueva

    createAssociation(association, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos."));
            }
            else {
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "INSERT INTO associations (name, email, description, social_media, location, web, logo) VALUES (?,?,?,?,?,?,?);",
                    [association.name, association.email, association.description, association.social_media, association.location, association.web, association.logo],
                    function (err, result) {
                        connection.release(); // Se libera la conexión                        
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callback(null, -1);
                        } else {
                            // Devuelve el resultado
                            callback(null, result.insertID);
                        }
                    }
                );
            }
        });
    }

    // Eliminar una asociación
    // @param idAssociation : id de la asociacion a borrar
    // @return none
    deleteAssociation(idAssociation, callBack) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callBack(new Error("Error de conexión a la base de datos."), null);
            }
            else {
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query("SELECT logo FROM associations WHERE id = ?",
                    [idAssociation],
                    function (err, result1) {
                        if (err) {
                            // Si hay algún error se muestra un mensaje
                            callBack(new Error("Error de consulta: deleteAssociation-> conseguir ID de asociación"), null);
                        } else {
                            // Se devuelve el resultado
                            connection.query(
                                "DELETE FROM associations WHERE id = ?",
                                [idAssociation],
                                function (err, result2) {
                                    if (err) {
                                        // Si hay algun error se muestra un mensaje
                                        callBack(new Error("Error de consulta: deleteAssociation-> al eliminar asociación."), null);
                                    } else {
                                        connection.query(
                                            // Se elimina la asociación de "Asociaciones seguidas"
                                            "DELETE FROM join_association WHERE associationId = ?",
                                            [idAssociation],
                                            function (err, result3) {
                                                connection.release(); // Se libera la conexion                                            
                                                if (err) {
                                                    callBack(new Error("Error de consulta: deleteAssociation-> al eliminar seguidores de la asociación."), null);
                                                } else {
                                                    // Devuelve el resultado
                                                    callBack(null, result1[0].logo);
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });
            }
        });
    }

    // Seguir asociación
    // @param idAssociation : id de la asociacion a la que se desea seguir
    // @param email: email del usuario q
    // @return True: si ha sido satisfactorio || False: no se ha producido
    joinAssociation(idAssociation, email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de acceso a la base de datos " + err), null);
            }
            else {
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    'INSERT INTO join_association (userMail, associationId) VALUES (?,?);',
                    [email, idAssociation],
                    function (err) {
                        connection.release(); // Se libera la conexión
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callback(null, false);
                        }
                        else {
                            //Resultado: Se sigue a la asociación
                            callback(null, true);
                        }
                    }
                )
            }

        }
        );
    }
    //integrar con front
    // @param association : objeto association que contiene los datos a actualizar
    // @return none
    updateAssociation(association, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                // Si la conexión a la BBDD falla, se muestra un mensaje de error
                callback(new Error("Error de conexión a la base de datos."));
            }
            else {
                // Si la conexión a la BBDD tiene éxito se hace la consulta
                connection.query(
                    "UPDATE associations SET name = ?, description = ?, social_media = ?, location = ?, web = ?, logo = ? WHERE id = ?",
                    [association.name, association.description, association.social_media, association.location, association.web, association.logo, association.id],
                    function (err) {
                        connection.release(); // Se libera la conexión                        
                        if (err) {
                            // Si hay algun error se muestra un mensaje
                            callback(new Error("Error de consulta: updateAssociation"));
                        } else {
                            // Devuelve el resultado
                            callback(null);
                        }
                    }
                );
            }
        });
    }
}

//Exportacion del modelo para pdoer usarlo luego en el controlador. 
module.exports = DAOAssociations;