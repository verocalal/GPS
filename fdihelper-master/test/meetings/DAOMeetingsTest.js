const {describe = global.describe, it = global.it} = require('mocha');
const { expect, should, assert } = require('chai');
const testUtils = require('../../utils_testing/testUtils');
const entityExamples = require('../../utils_testing/SQLPopulate');

describe("DAOMeetings",()=>{  
  before(function(){
    return new Promise(function(resolve, reject){
     for(let i=0;i< entityExamples.meetings.length;i++){
       testUtils.populateDatabaseMeetings(entityExamples.meetings[i],(err, res)=>{
         if(err){
           console.log("Problema al popular BBDD de Meetings");
           reject(err);
         }
         else{
          entityExamples.meetings[i].id = res.insertId;
           console.log("Insertado Meeting " + res.insertId);
           if(i>= entityExamples.meetings.length -1){
             resolve(res);
           }   
         }
       })
     }
    })
   })
    describe("#getMeetings()",()=>{
        it('sould return an array with correct parameters of a meeting list',(done)=>{
          testUtils.DAOMeetingsTests.getMeetings((err, meetings)=>{
                expect(meetings).to.be.an('array');
                meetings.forEach(meeting=>{
                    expect(meeting).to.have.property('user').that.is.a('string')
                    expect(meeting).to.have.property('title').that.is.a('string')
                    expect(meeting).to.have.property('subject').that.is.a('string')
                    expect(meeting).to.have.property('comments').that.is.a('string')
                    expect(meeting).to.have.property('capacity').that.is.a('number')
                    expect(meeting).to.have.property('location').that.is.a('string')
                    expect(meeting).to.have.property('state').that.is.a('string')
                    expect(meeting).to.have.property('datetime_meeting').that.is.a('string')
                })
                done();
            })
        })
    })
    describe('#getMeetingInfo()',()=>{
      it('should return a meeting with correct paremeters of a meeting',(done)=>{
        testUtils.DAOMeetingsTests.getMeetings((err,meetings)=>{
          testUtils.DAOMeetingsTests.getMeetingInfo(meetings[0].id,(err,meeting)=>{
            expect(meeting).to.include.all.keys('id','user','title','subject','comments','capacity','state','date');

            expect(meeting).to.have.property('id').that.is.a('number')
            expect(meeting).to.have.property('user').that.is.a('string')
            expect(meeting).to.have.property('title').that.is.a('string')
            expect(meeting).to.have.property('subject').that.is.a('string')
            expect(meeting).to.have.property('comments').that.is.a('string')
            expect(meeting).to.have.property('capacity').that.is.a('number')
            expect(meeting).to.have.property('location').that.is.a('string')
            expect(meeting).to.have.property('state').that.is.a('string')
            expect(meeting).to.have.property('date_meeting').that.is.a('string')
            expect(meeting).to.have.property('time_meeting').that.is.a('string')
            done();
          })
        })
      })

      it('should not return meeting info because of non-existent meeting',(done)=>{
        var idMeeting = -1;//segun tu bdd///////
        testUtils.DAOMeetingsTests.getMeetingInfo(idMeeting,(res,meeting)=>{
          expect(meeting).to.be.undefined;
          done();
        });
      })
    })

    describe('#delete()',()=>{
      it('should delete a meeting',(done)=>{
        testUtils.DAOMeetingsTests.getMeetings((err,meetings)=>{
          testUtils.DAOMeetingsTests.delete(meetings[2],(err,result)=>{
            expect(result.affectedRows).to.equal(1);
            done();
          })
        })
      })
      it('should not delete a meeting because its non-existent',(done)=>{
        let meetingPost = {
          id: -1,
          user: "non-existent",
          title: "non-existent",
          subject: "non-existent",
          comments: "non-existent",
          capacity: "non-existent",
          state: "non-existent",
          date: "non-existent"
        }
        testUtils.DAOMeetingsTests.delete(meetingPost,(err,result)=>{
          expect(result.affectedRows).to.equal(0);
          done();
        })
      })
    })

    describe('#createMeeting',()=>{
      it('should create a meeting',(done)=>{
        testUtils.DAOMeetingsTests.createMeeting({ 
          user:"usuarioMeeting1", 
          title:"tituloMeeting1",
          subject :"subjectMeeting1", 
          comments :"comentariosMeeting1", 
          capacity : 2, 
          location: "locationMeeting1",
          state :"ACTIVO",
          datetime: "2020-05-20 10:00:00"
      },(res)=>{
          expect(res).to.be.null;
          done();
        })
      })

      it('should not create a meeting because user is empty',(done)=>{
        testUtils.DAOMeetingsTests.createMeeting({ 
          user: null, 
          title:"tituloMeeting1",
          subject :"subjectMeeting1", 
          comments :"comentariosMeeting1", 
          capacity : 2, 
          state :"ACTIVO",
          datetime: '2020-05-20 10:00:00'
      },(res)=>{
          expect(res).to.not.be.null;
          done();
        })
      })
    })

    describe("#updateMeeting",()=>{
      it('should update a meeting',(done)=>{
          entityExamples.meetings[1].title = 'Edited title';
          testUtils.DAOMeetingsTests.updateMeeting(entityExamples.meetings[1],(err, resp)=>{
          expect(err).to.be.null
          done();
        })
        
      })
    })

    describe('#joinMeeting',()=>{
      it('should join a meeting', (done)=>{
        let id = entityExamples.meetings[1].id;
        let userMail = entityExamples.users[1].email;
        testUtils.DAOMeetingsTests.joinMeeting(id, userMail,(err, res)=>{
          expect(err).to.be.null;
          expect(res).to.be.true;
          done();

        })
      })
    })

    describe('#unjoinMeeting()',()=>{
      it('should unjoin a meeting', (done)=>{
        let id = entityExamples.meetings[1].id;
        let userMail = entityExamples.users[1].email;
        testUtils.DAOMeetingsTests.joinMeeting(id, userMail,(err, res)=>{
          testUtils.DAOMeetingsTests.unjoinMeeting(id,userMail,(err2,res2)=>{
            expect(err2).to.be.null;
            done();
          })
        })
      })
    /*it('should not unjoin a meeting', (done)=>{
        let id = ":)";
        let userMail = entityExamples.users[1].email;
        testUtils.DAOMeetingsTests.joinMeeting(id, userMail,(err, res)=>{
          testUtils.DAOMeetingsTests.unjoinMeeting(id,userMail,(err2,res2)=>{
            expect(err2).to.not.be.null;
            done();
          })
        })
      })*/
    })
})
