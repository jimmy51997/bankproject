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
const aws = require('aws-sdk');

aws.config.region = 'ap-south-1';
const S3_BUCKET = process.env.S3_BUCKET;

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
// responsible for generating and returning the signature with which the client-side JavaScript can upload the image
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});
//till here
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


