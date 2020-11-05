const {describe = global.describe, it = global.it} = require('mocha');
const { expect, should, assert } = require('chai');
const testUtils = require('../../utils_testing/testUtils');
const entityExamples = require('../../utils_testing/SQLPopulate');




describe('DAOAssociations',()=>{
  before(function(){
    return new Promise(function(resolve, reject){
      for(let i = 0 ;i<entityExamples.asociations.length;i++){
        testUtils.populateDatabaseAssociations(entityExamples.asociations[i], (err, res)=>{
          if(err){
            console.log("Problema al popular BBDD de Associations");
            reject(err);
          }
          else{
            entityExamples.asociations[i].id = res.insertId;
            console.log("Insertado Association " + res.insertId);
            if(i >= entityExamples.asociations.length - 1){
              resolve(res);
            }
          }
        })      
      }
    })
  })
    describe('#getAssociations()',()=>{
        it('sould return an array with correct parameters of a associations list',(done)=>{
            testUtils.DAOAssociationsTests.getAssociations((err,associations)=>{
                expect(associations).to.be.an('array');
                associations.forEach(association => {
                    expect(association).to.have.property('id').that.is.a('number')
                    expect(association).to.have.property('name').that.is.a('string')
                    expect(association).to.have.property('email').that.is.a('string')
                    expect(association).to.have.property('description').that.is.a('string')
                    expect(association).to.have.property('social_media').that.is.a('string')
                    expect(association).to.have.property('location').that.is.a('string')
                    expect(association).to.have.property('web').that.is.a('string')
                    expect(association).to.have.property('logo').that.is.a('string')
                });
                done();
            })
        })
    })

    describe('#getAssociationInfo',()=>{
        it('should return an association with correct paremeters of an association',(done)=>{
            testUtils.DAOAssociationsTests.getAssociations((err,associations)=>{
                testUtils.DAOAssociationsTests.getAssociationInfo(associations[0].id,(err,association)=>{
                  expect(association).to.include.all.keys('id','name','email','description','social_media','location','web','logo');
      
                  expect(association).to.have.property('id').that.is.a('number')
                  expect(association).to.have.property('name').that.is.a('string')
                  expect(association).to.have.property('email').that.is.a('string')
                  expect(association).to.have.property('description').that.is.a('string')
                  expect(association).to.have.property('social_media').that.is.a('string')
                  expect(association).to.have.property('location').that.is.a('string')
                  expect(association).to.have.property('web').that.is.a('string')
                  
                  done();
                })              
            })
        })

        it('should not return association info because of non-existent association',(done)=>{
            var idAssociation = -1;//segun tu bdd///////
            testUtils.DAOAssociationsTests.getAssociationInfo(idAssociation,(res,association)=>{
              expect(association).to.be.undefined;
              done();
            });        
        })    
    })

    describe('#createAssociation',()=>{
        it('should create a association',(done)=>{
            testUtils.DAOAssociationsTests.createAssociation({ 
              name:"usuarioAssociation1", 
              email:"emailAssociation1",
              description :"descriptionAssociation1", 
              social_media :"socialMediaAssociation1", 
              location : 'locationAssociation1', 
              web : "webAssociation1",
              logo : "ascii.png"
          },(res)=>{
              expect(res).to.be.null;
              done();
            })
          })

          it('should not create a association',(done)=>{
            testUtils.DAOAssociationsTests.createAssociation({ 
              name:null, 
              email:"emailAssociation1",
              description :"descriptionAssociation1", 
              social_media :"socialMediaAssociation1", 
              location : 'locationAssociation1', 
              web : "webAssociation1",
              logo : "ascii.png"
          },(err, res)=>{
              expect(res).to.equal(-1);
              done();
            })
          })
    })

    describe("#deleteAssociation",()=>{
      it('should delete association', (done)=>{
        testUtils.DAOAssociationsTests.getAssociations((err, associations)=>{
          testUtils.DAOAssociationsTests.deleteAssociation(associations[0].id, (err, result)=>{
            expect(result).to.equal(associations[0].logo);
            done();
          })

        })
      })

      it('should not delete an association because its non-existent',(done)=>{
        let associationPost = {
          id: -1,
          name : "non-existent",
          email : "non-existent",
          description : "non-existent",
          social_media : "non-existent",
          location : "non-existent",
          web: "non-existent",
          logo: "non-existent"
        }  
        testUtils.DAOAssociationsTests.deleteAssociation(associationPost,(err,result)=>{
          expect(result).to.be.null;
          done();
        })
      })

    })

    describe("#updateAssociation()", ()=>{
      it('should update an association',(done)=>{
        let association = entityExamples.asociations[1];
        association.description='changed desc';
        testUtils.DAOAssociationsTests.updateAssociation(association,(err)=>{
          expect(err).to.be.null;
          done();
        })
      })
    })

    describe("#joinAssociation()", ()=>{
      it("user should join an association",(done)=>{
        testUtils.DAOAssociationsTests.getAssociations((err, associations)=>{
          let user = entityExamples.users[1];
          testUtils.DAOAssociationsTests.joinAssociation(associations[0].id,user.email,(err,res)=>{
            expect(res).to.be.true;
            done();
          })
        })
      })

      /*it("user should not join an association because user's email does not exist",(done)=>{
        testUtils.DAOAssociationsTests.getAssociations((err, associations)=>{
          let userEmail = ":)";
          testUtils.DAOAssociationsTests.joinAssociation(associations[0].id,userEmail,(err,res)=>{
            expect(res).to.be.false;
            done();
          })
        })
      })

      it("user should join an association because association does not exist",(done)=>{
        let idAssociation = "-1";
        let user = entityExamples.users[1];
        testUtils.DAOAssociationsTests.joinAssociation(idAssociation,user.email,(err,res)=>{
          expect(res).to.be.false;
          done();
        })
      })*/
    })
})