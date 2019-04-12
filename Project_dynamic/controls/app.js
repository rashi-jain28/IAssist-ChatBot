var express = require('express');
var userDB = require('../model/userDB');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var ProfileController = require('../Controller/ProfileController');
app.set('view engine', 'ejs');
app.use('/resources', express.static('resources'));
const { check, validationResult} = require('express-validator/check');
var urlencodedParser = bodyParser.urlencoded ({ extended: false });
app.use(session({
  secret: 'this-is-a-secret-token'
}));
app.use(function(req, res, next) {
  res.locals.user = req.session.theUser;
  next();
});
app.get('/index', function(req, res){
  res.render('index');
});
app.get('/user', function(req, res){
  res.render('user');
});
app.get('/', function(req, res){
  res.render('index');
});

app.get('/about', function(req,res){
  res.render('about');
});

app.get('/contact', function(req,res){
  res.render('contact');
});

app.get('/signout', function(req, res){
  req.session.theItem = undefined;
  req.session.theUser = undefined;
  res.redirect('login');
});
app.get('/login', function(req, res){
  res.render('login',{errors:"",dberror:""});
});

app.post('/login', urlencodedParser,ProfileController.login
);

app.get('/registration', function(req, res){
  res.render('registration',{errors:""});
});
app.post('/registration*',urlencodedParser,
  check('fname','Error').trim().isAlpha().withMessage('Field should have alphabets'),
  check('lname').trim().isAlpha().withMessage('Field should have alphabets'),
  check('email')
    .isEmail().withMessage('Please enter a valid email address')
    .trim()
    .normalizeEmail()
    .custom(value => {
      console.log(value);
      return userDB.findUserByEmail(value).then(User => {
    //if user email already exists throw an error
  })
}),
  check('ninerID')
  .trim()
  .custom(value => {
    return userDB.findUserByID(value).then(User => {
    //if user email already exists throw an error
  })
}),ProfileController.register);
app.get('/*', function(req,res){
  res.send('Page Not found');
});

app.listen(8081);
