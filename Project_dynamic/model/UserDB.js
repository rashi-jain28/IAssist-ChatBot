var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ninernet');
var users = require('../model/user');
var await = require('asyncawait/await');

var users = mongoose.Schema({
  ninerID:Number,
  firstName: String,
  lastName:String,
  emailAddress:String,
  password:mongoose.Mixed
},{collection:'users'});

var Users = mongoose.model('users',users);

const getUsers = async function(){
  const arr = await Users.find({ });
  return arr;
}
const getUserByEmailPassword = async function(emailAddress,pwd){
  const arr = await Users.find({emailAddress:emailAddress, password:pwd},{"userID":1});
  return arr;
}
const findUserByEmail = async function(email){
  if(email){
     return new Promise((resolve, reject) => {
       Users.findOne({ emailAddress: email })
         .exec((err, doc) => {
           if (err) return reject(err)
           if (doc) return reject(new Error('This email already exists.'))
           else return resolve(email)
         })
     })
   }
}
const findUser = async function(ninerID){
  const arr = await Users.find({ninerID:ninerID});
  console.log(arr);
  return arr
}
const findUserByID = async function(ninerID){
  if(ninerID){
     return new Promise((resolve, reject) => {
       Users.findOne({ ninerID: ninerID })
         .exec((err, doc) => {
           if (err) return reject(err)
           if (doc) return reject(new Error('This ninerID already exists. Please Login only'))
           else return resolve(ninerID)
         })
     })
   }
}
const addUser = async function(ninerID,firstName, lastName, emailAddress, password){
    var user = new Users({
      ninerID: ninerID,
      firstName: firstName,
      lastName:lastName,
      emailAddress:emailAddress,
      password:password,
    })
    const arr = user.save();
  }

  module.exports.getUsers = getUsers;
  module.exports.getUserByEmailPassword = getUserByEmailPassword;
  module.exports.addUser = addUser;
  module.exports.findUserByEmail = findUserByEmail;
  module.exports.findUserByID = findUserByID;
  module.exports.findUser = findUser;
