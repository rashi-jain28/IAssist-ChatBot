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
            console.log("Error saving user: ");
            console.log(error);
            next();
        });
  }

exports.login= async function(req, res){
  const error = validationResult(req);
  console.log('error is');
  console.log(error.mapped());
  if(!error.isEmpty()){
    res.render('login',{errors:error.mapped(),dberror:""});
    return ;
  }
  var password = req.body.password;
  console.log(req.body.ninerID);
  await userDB.findUser(req.body.ninerID)
    .then(function(user) {
      console.log('***************');
      console.log(user);
      console.log(user[0].password);
        bcrypt.compare(password, user[0].password)
        .then(function(samePassword) {
            if(!samePassword) {
                res.render('login',{errors:"",dberror:"Invalid username or password"});
            }
            req.session.theUser = user[0].ninerID;
            res.render('user')
        })
    })
    .catch(function(error){
        console.log("Error authenticating user: ");
        console.log(error);
        next();
    });
}
