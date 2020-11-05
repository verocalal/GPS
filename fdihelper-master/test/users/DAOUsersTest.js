const {describe = global.describe, it = global.it} = require('mocha');
const { expect, should, assert } = require('chai');
const chai = require('chai');
const chaihttp = require('chai-http');
const testUtils = require('../../utils_testing/testUtils');
const entityExamples = require('../../utils_testing/SQLPopulate');

describe('DAOUsers',function(){
  
  before(function(){
    return new Promise(function(resolve, reject){
      for(let i = 0 ;i<entityExamples.users.length;i++){
        testUtils.populateDatabaseUsers(entityExamples.users[i], (err, res)=>{
          if(err){
            console.log("Problema al popular BBDD de Users");
            reject(err);
          }
          else{
            console.log("Insertado User " + res.insertId);
            if(i >= entityExamples.users.length - 1){
              resolve(res);
            }
          }
        })      
      }
    })
  })
  describe('#createUser()', ()=>{
    it('should not create new user because mail is already in use',(done)=>{
      let User={
        username: "usuarioUser3",
        email: "emailUser",
        pass:"passwordUser",
        date_birth: "1993-06-04",
        image: null,
        type_user: 1
      }
      testUtils.DAOUsersTests.signup(User,(err, resp)=>{
        expect(err).to.be.null;
        expect(resp).to.be.null;
        done();
      })
    })
  
    it('should not create new user because of bad field',(done)=>{
      let User={
        username: null,
        email: "email",
        password:"passwordUser"
      }
      testUtils.DAOUsersTests.signup(User,(err, resp)=>{
        expect(err).to.not.be.null;
        done();
      })
    })

    it('should create new association user',(done)=>{
      let User={
        username: "assUser",
        email: "emailAssUser",
        pass:"passwordAssUser",
        date_birth: "1995-07-21",
        image: null,
        type_user: 0
      }
      testUtils.DAOUsersTests.signup(User,(err, resp)=>{
        expect(err).to.be.null;
        done();
      })
    })
  })

  describe('#userLogin()', ()=>{
    it('should login correctly',(done)=>{
      let User = entityExamples.users[0];
      testUtils.DAOUsersTests.userLogin(User.email, User.password,(err, res)=>{
        expect(err).to.be.null;
        expect(res).to.equal(User.email);
        done();
      })
    })

    it('should login correctly by client request',(done)=>{
      let User = entityExamples.users[0];
      chai.use(chaihttp).request(testUtils.serverhttp).post("/users/login").
      type('form')
      .send({
        email: User.email,
        password: User.password
      })
      .end((err, res)=>{
        expect(res).to.have.status(200);
        done();
      })
      
    })

    it('should not login because User doesnt exist',(done)=>{
      let User = {
        name: 'doesnt',
        email: 'exist',
        password: ':('
      }
      testUtils.DAOUsersTests.userLogin(User.email, User.password,(err, res)=>{
        expect(err).to.be.null;
        expect(res).to.be.null;
        done();
      })
    })
  })

  describe('#logout',()=>{
    it('should logout sucesfully',(done)=>{
      chai.use(chaihttp).request(testUtils.serverhttp).get('/users/logout').
        end((err,res)=>{
          expect(res).to.have.status(200);
          done();
        })
    })
  })

  describe('#update()',()=>{
    it('should update correctly',(done)=>{
      let User = {
        username: 'newName',
        email: 'emailUser',
        date_birth: new Date(2019,6,5),
        image: null
      }
      testUtils.DAOUsersTests.updateUser(User.email,User,res=>{
       testUtils.DAOUsersTests.getUser(User.email,(err,res)=>{
          expect(res.username).be.equal('newName');
          expect(res.date_birth).that.is.a('Date')
          expect(res.image).to.be.equal(null);
          done();
        })
      })
    })
    it('should not update correctly because email doesnt exist',(done)=>{
      let User = {
        username: 'newName',
        email: ':)',
        date_birth: "1993-06-04",
        image: null,
      }
      testUtils.DAOUsersTests.updateUser(User.email,User,res=>{
       testUtils.DAOUsersTests.getUser(User.email,(err,res)=>{
        expect(err).to.be.null;
        expect(res).to.be.null;
        done();
        })       
      })     
    })
  })

  describe('#getProfileInfo()',()=>{    

    it('should return a user with correct paremeters of a user',(done)=>{
      let User = entityExamples.users[0];
      testUtils.DAOUsersTests.getUser(User.email, (err,res)=>{
        testUtils.DAOUsersTests.getProfileInfo(res.email,(err,user)=>{
          expect(user).to.include.all.keys('username','email','date','date_birth','image','type_user');
          expect(user).to.have.property('username').that.is.a('string')
          expect(user).to.have.property('email').that.is.a('string')
          expect(user).to.have.property('date').that.is.a('Date')
          expect(user).to.have.property('date_birth').that.is.a('string')
         // expect(user).to.have.property('image').that.is.a('image/png')
          expect(user).to.have.property('type_user').that.is.a('string')
          done();
        })
      })
    })

    it('should not return a user with correct paremeters of a user',(done)=>{
      let User = {
        username: 'newName',
        email: ':)',
        password: 'newPassword'
      }
      testUtils.DAOUsersTests.getProfileInfo(User,(err,user)=>{
        expect(user).to.be.undefined;
        done();
       })
    })
  })
/*
  describe('#getAssociations()', ()=>{
    it('should return the asociations that the user is following',(done)=>{
     let User = entityExamples.users[0];
     testUtils.DAOUsersTests.getAssociations(User.email,(err,res)=>{
      testUtils.DAOAssociationsTests.getAssociationInfo(res[0].id,(err,association)=>{
        expect(association).to.include.all.keys('id','name','email','description','social_media','location','web','logo');

        expect(association).to.have.property('id').that.is.a('number')
        expect(association).to.have.property('name').that.is.a('string')
        expect(association).to.have.property('email').that.is.a('string')
        expect(association).to.have.property('description').that.is.a('string')
        expect(association).to.have.property('social_media').that.is.a('string')
        expect(association).to.have.property('location').that.is.a('string')
        expect(association).to.have.property('web').that.is.a('string')
        expect(association).to.have.property('logo').that.is.a('string')
      })
     })
    })
  })
*/
})