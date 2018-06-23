const path = require('path')
const express = require('express') ;
//const layout = require('express-layout') ;
const app = express() ;
const routes = require('./routes') ;
var MongoClient = require('mongodb').MongoClient ;
const bodyParser = require('body-parser') ;
const cookieParser = require('cookie-parser') ;
const session = require('express-session') ;
const flash = require('express-flash') ;
const validator = require('express-validator') ;


const middleware = [
  bodyParser.urlencoded({extended: false}),
  validator(),
  cookieParser(),
  session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }),
  flash()
] ;

app.use(middleware) ;
app.use(express.static('public')) ;
app.use(express.static('bower_components')) ;
app.use('/',routes) ;

app.set('views','./src/views') ;
app.set('view engine','ejs') ;

 
var port = process.env.PORT || 8080 ;
//process.env.PORT || 5000
app.listen(port,function(err){
	console.log(port) ;
}) ;


