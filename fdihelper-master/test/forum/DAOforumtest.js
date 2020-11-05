const {describe = global.describe, it = global.it} = require('mocha');
const { expect } = require('chai');
var assert = require('assert');

const mysql = require("mysql");
const testUtils = require('../../utils_testing/testUtils');
const entityExamples = require("../../utils_testing/SQLPopulate")

describe('DAOForum', function() {
  before(function(){
    return new Promise(function(resolve, reject){
      let cont=0;
      entityExamples.topics.forEach(topic=>{
        testUtils.populateDatabaseTopics(topic,(err,resp)=>{
          if(err){
            console.log("Problema al popular BBDD de Topics");
            reject(err);
          }
          else{
            console.log("Insertado Topic " + resp.insertId);
            entityExamples.answers[cont].id_topic = resp.insertId;
            testUtils.populateDatabaseAnswers(entityExamples.answers[cont],(err,resp2)=>{
              if(err){
                console.log("Problema al popular BBDD de Topics");
                reject(err);
              }
              else{
                console.log("Insertado Answer " + resp2.insertId);
                entityExamples.answers[cont].id = resp2.insertId;
                cont++; 
                if(cont>=entityExamples.topics.length)
                  resolve(resp);
              }
            })
          }
        })
      })  
    })
  })

  describe('#getTopics()', function() {
    it('should return an array',  function(done){ 
      testUtils.DAOForumTests.getTopics( (res, topics)=>{
        expect(res).to.be.null;
        expect(topics).to.be.an('array');
        done();
      });
    });
    it('should have the correct parameters of a topic list',  function(done){ 
      testUtils.DAOForumTests.getTopics((res, topics)=>{
        expect(res).to.be.null;
        expect(topics).to.be.an('array');
        topics.forEach(topic => {
          expect(topic).to.have.property('user')
              .that.is.a('string')
          expect(topic).to.have.property('title')
              .that.is.a('string')
          expect(topic)
              .to.have.property('category')
              .that.is.a('string')
          expect(topic)
              .to.have.property('subcategory')
              .that.is.a('string')
          expect(topic)
              .to.have.property('subcategory')
              .that.is.a('string')
          expect(topic).to.have.property('date')
              .that.is.a('string')
        });
        done();
      });      
    });
  });

  describe('#create()', function(){
    it('should create a new Topic', function(done){      
      testUtils.DAOForumTests.create({
        title: "createtest1",
        content: "createtest1",
        category: "createtest1",
        subcategory: "createtest1",
        user: "createtest1"
    }, (res,resnull)=>{
        expect(res).to.be.null;
        expect(resnull.affectedRows).to.equal(1);
        done();
      });
    });

    it('should not create a new Topic because title key is wrong', function(done){      
      testUtils.DAOForumTests.create(
        {
          itle: "createtest2",
          content: "createtest2",
          category: "createtest2",
          subcategory: "createtest2",
          user: "createtest2"
      }, (res,resnull)=>{
        expect(res).to.not.be.null;
        done();
      });
    });

    it('should not create a new Topic because content is null', function(done){      
      testUtils.DAOForumTests.create(
        {
          title: "createtest3",
          content: null,
          category: "createtest3",
          subcategory: "createtest3",
          user: "createtest3"
      }, (res,resnull)=>{
        expect(res).to.not.be.null;
        done();
      });
    });
  });

  describe('#delete()',function(){
    it('should delete topic',function(done){
      let DAOForo =testUtils.DAOForumTests;
      DAOForo.getTopics((res, topics)=>{
        let reultstopics =  topics;
        DAOForo.delete(reultstopics[1],(res,result)=>{
          expect(res).to.be.null;
          done();
        })      
      });
    });

    it('should not delete a topic because its non-existent',function(done){
      let DAOForo = testUtils.DAOForumTests;
      let forumPost = {
        id: -1,
        title: "non-existent",
        content: "non-existent",
        category: "non-existent",
        subcategory: "non-existent",
        user: "non-existent"
      }
      DAOForo.delete(forumPost,(res,result)=>{
        expect(result.affectedRows).to.equal(0);
        done();
      });
    });
  });

  describe('#getTopicInfo()',function(){

    it('should return topic with correct parameters',function(done){
      let DAOForo = testUtils.DAOForumTests;
      DAOForo.getTopics((res, topics)=>{
        DAOForo.getTopicInfo(topics[0].id,  (res,topic)=>{
          expect(res).to.be.null;
          expect(topic).to.include.all.keys('id','user','title','category','subcategory','content','date');
          done();
        });
      });
    });

    it('should not return topic info because of non-existent topic',function(done){
      var idTopic = -1;//segun tu bdd///////
      testUtils.DAOForumTests.getTopicInfo(idTopic,(res,topic)=>{
        expect(topic).to.be.undefined;
        done();
      });
    });
  });

  describe('#answer',()=>{
    it('should write an answer in the database',(done)=>{
      testUtils.DAOForumTests.getTopics((err,topics)=>{
        expect(err).to.be.null;
        let resultfound = entityExamples.answers.find(answer => answer.content == 'createtest1');
        resultfound.id = topics[0].id;
        resultfound.answer = resultfound.content;
        testUtils.DAOForumTests.answer(resultfound,(err,result)=>{
          expect(err).to.be.null;
          expect(result.affectedRows).to.equal(1);
          done();
        })
      })
    })

    it('should not write an answer in the database because topic doesnt exist',(done)=>{
        let badAnswer = {
          id: -1,
          content:"bad",
          user: "bad"
        }
        testUtils.DAOForumTests.answer(badAnswer,(err,result)=>{
          expect(err).to.not.be.null;
          expect(result).to.be.null;
          done();
        })      
    })
  })

  describe('#deleteAnswer',()=>{
    it('should delete an answer',function(done){
      testUtils.DAOForumTests.deleteAns(entityExamples.answers[0].id,(err, res)=>{
        expect(err).to.be.null;
        done();
      });
    });
  })

  describe('#updateTopic',()=>{
    it('should update Topic',function(done){
      entityExamples.topics[0].content = "editado";
      testUtils.DAOForumTests.updateTopic(entityExamples.topics[0],(err, res)=>{
        expect(err).to.be.null;
        done();
      });
    });
  })
});

after(function(){
    testUtils.emptyDatabaseAnswers((err, result)=>{
      if(err){
        throw err;
      }
      else{
        testUtils.emptyDatabaseTopics((err, result)=>{
          if(err){
            throw err;
          }
          else{            
            console.log("Database emptied of topics and answers");
          }
        })
      }
    })
})