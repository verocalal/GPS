const {describe = global.describe, it = global.it} = require('mocha');
const { expect, should, assert } = require('chai');
const testUtils = require('../utils_testing/testUtils');
const entities = require('../utils_testing/SQLPopulate');
const config = require("../utils/config");

after(function(){

    testUtils.emptyDatabaseMeetings((err, result)=>{
    if(err){
      console.log("Problema al vaciar la BBDD de reuniones");
      throw err;
    }
    else{
      console.log("Database emptied of meetings");
    }
  })
  
    testUtils.emptyDatabaseAssociations((err, result)=>{
      if(err){
        console.log("Problema al vaciar la BBDD de asociaciones");
        throw err;
      }
      else{
         console.log("Database emptied of associations");
      }
    })

    testUtils.emptyDatabaseUsers((err, result)=>{
      if(err){
        console.log("Problema al vaciar la BBDD de usuarios");
        throw err;
      }
      else{
         console.log("Database emptied of users");
      }
    })

    setTimeout(function(){
        testUtils.terminateConnection((res)=>{
        if(res) {
          console.log(res);
        }
        else console.log("Connection terminated"); 
    });},config.port);  
  })