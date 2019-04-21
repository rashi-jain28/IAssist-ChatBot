var express = require('express');
var userDB = require('../model/userDB');
var app = express();
var session = require('express-session');
app.set('view engine', 'ejs');
const { check, validationResult} = require('express-validator/check');
// for hashing
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = 12;
app.use(session({
  secret: 'this-is-a-secret-token'
}));

//registration
exports.register= async function(req, res){
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.render('registration',{errors:error.mapped()});
    return ;
  }

  var password = req.body.password;
  bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    .then(async function(hashedPassword) {
        //return usersDB.saveUser(username, hashedPassword);
        await userDB.addUser(req.body.ninerID,req.body.fname,req.body.lname,req.body.email,
                                            hashedPassword);
        req.session.theUser = req.body.ninerID;
        res.redirect('/user')
    })
    .catch(function(error){
            next();
        });
  }


//login
exports.login= async function(req, res){
  const error = validationResult(req);
  if(!error.isEmpty()){
    res.render('login',{errors:error.mapped(),dberror:""});
    return ;
  }
  var password = req.body.password;
  await userDB.findUser(req.body.ninerID)
    .then(function(user) {
      if(user.length!=0)
      {
        bcrypt.compare(password, user[0].password)
        .then(function(samePassword) {
            if(!samePassword) {
                res.render('login',{errors:"",dberror:"Invalid username or password"});
            }
            req.session.theUser = user[0].ninerID;
            req.session.theUserName = user[0].firstName;
            res.redirect('/user');
            //res.render('user')
        })
      }
      else{
        res.render('login',{errors:"",dberror:"Invalid username or password"});
      }
    })
    .catch(function(error){
        next();
    });
}
