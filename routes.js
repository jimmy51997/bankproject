const express = require('express') ;
const router = express.Router() ;
const {check,validationResult} = require('express-validator/check') ;
const { matchedData } = require('express-validator/filter') ;
const aws = require('aws-sdk');
var MongoClient = require('mongodb').MongoClient ;
var multer = require('multer') ;
var mkdirp = require('mkdirp') ;
var nodemailer = require('nodemailer') ;

var storage = multer.diskStorage({
	destination: function(req,file,cb){
		var dest1 = req.body.date_ ;
		dest1 = dest1.substring(11,15) ;
		var dest = './public/uploads/pnb/'+dest1.toString()+'/'  ;
		mkdirp.sync(dest) ;
		cb(null,dest) ;
	},
	filename: function(req,file,cb){
         cb(null,req.body.htextforpf+ '_'+file.fieldname+ '_' + file.originalname ) ;
	}
}) ;
var upload = multer({storage: storage}) ;


aws.config.region = 'ap-south-1';
const S3_BUCKET = process.env.S3_BUCKET;

router.get('/', (req, res) => {
  console.log('hello world') ;
}) ;

var list = new Array() ;
var list2 = new Array() ;


router.get('/pnb',function(req,res){
	 console.log("completed till 32") ;
   var url = "mongodb://jimmy:jimmy51997@ds263740.mlab.com:63740/db_bank" ;
	MongoClient.connect(url,function(err,db){
     if(err) throw err ;
      var dbo = db.db("db_bank") ;   
 //including the branchlist in br_list select input
 // the list rendered from here is list

      dbo.collection("t_pnb_desig").find({}).toArray(function(err,result){
          list = result ;
      }) ;
      
 //including the designation mapping in desig select input
 //the list rendered from here is list2
      dbo.collection("t_pnb_branchlist").find({}).toArray(function(err,result){
          list2 = result ;
          res.render('index',{ list: list, list2: list2  }) ;
      }) ;
       
	}) ;
	//res.send("Hello world") ;
}) ;

router.post('/pnb',upload.any(),
	function(req,res){
  //code for sending mail here
  var transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'Idsdeveloper@outlook.com',
      pass: 'ID$Developer'
    }
  }) ;
   //assigning the path where signatute and photo is saved as string
   var phf = req.files[0].path.toString() ;
   var sigf = req.files[1].path.toString() ;
  var tosend = 'New card application form submitted for pnb\n' +  'pfno:' + req.body.htextforpf+ ',\n'  +  
        'date_:'+ req.body.date_+ ',\n'+
        'br_info:'+ req.body.br_info+',\n'+
        'f_name:'+ req.body.f_name+',\n' +
        'm_name:' + req.body.m_name + ',\n'+
        'l_name:' +req.body.l_name+',\n'+
        'f_namehin:' + req.body.f_namehin + ',\n'+
        'desig:'+ req.body.desig+',\n'+
        'bgrp:'+ req.body.bgrp+ ',\n'+
        'dob:' +req.body.dob+',\n'+
        'addressl1:'+ req.body.addressl1+ ',\n'+
        'addressl2:' + req.body.addressl2 + ',\n'+
        'addressl3:'+ req.body.addressl3+ ',\n'+
        'mob_no :'+ req.body.mob_no + ',\n'+
        'mob_no2 :'+  req.body.mob_no2+ ',\n'+
        'email:'+ req.body.email+',\n'+
        'pan:' +req.body.pan+ ',\n'+
        'photo:'+  phf + ',\n'+
        'signature:'+  sigf  ;

  var mailOptions = {
    from: 'Idsdeveloper@outlook.com', // sender address
    to: 'jimmyrhodes51997@gmail.com', // list of receivers
    subject: 'Email Example', // Subject line
    text: tosend //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  }

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
  });
 //code for sending mail ends here
	console.log(req.files[0]) ;
    var url = "mongodb://jimmy:jimmy51997@ds263740.mlab.com:63740/db_bank" ;
	MongoClient.connect(url,function(err,db){
     if(err) throw err ;
      var dbo = db.db("db_bank") ;   
 //including the branchlist in br_list select input
 // the list rendered from here is list
     
      dbo.collection('t_pnb_card').update({"pfno":req.body.htextforpf},
      {
        $set: {
          pfno:  req.body.htextforpf 
        },
        $push : {   
        date_: req.body.date_ ,
        br_info: req.body.br_info,
        f_name: req.body.f_name, 
        m_name:  req.body.m_name,
        l_name: req.body.l_name,
        f_namehin: req.body.f_namehin,
        desig: req.body.desig,
        bgrp: req.body.bgrp,
        dob: req.body.dob,
        addressl1: req.body.addressl1,
        addressl2: req.body.addressl2,
        addressl3: req.body.addressl3,
        mob_no : req.body.mob_no,
        mob_no2 : req.body.mob_no2,
        email: req.body.email,
        pan: req.body.pan,
        photo: phf,
        signature: sigf 
       }
      },{upsert:true, reorder:false}) ;

      dbo.collection("t_pnb_desig").find({}).toArray(function(err,result){
          list = result ;
      }) ;
      
 //including the designation mapping in desig select input
 //the list rendered from here is list2
      dbo.collection("t_pnb_branchlist").find({}).toArray(function(err,result){
          list2 = result ;
      }) ;
       
	}) ;
		
  const errors = validationResult(req) ;
  if(!errors.isEmpty()){
    req.flash('fail',"sorry for that") ;
    console.log("I am reached") ;
    //including the branchlist in br_list select input
 // the list rendered from here is list
    return res.render('index',{
      list:list,
      list2:list2,
      data:req.body,
      errors: errors.mapped() 
    }) ;
  }

  const data = matchedData(req) ;
  console.log('Sanitized: ',req.body) ;
  //insert into database here

  req.flash('success','Your Response has been submitted आपकी प्रतिक्रिया जमा कर दी गई है') ;
  res.redirect('/pnb' ) ;
  
 }) ;

router.get('/routing',function(req,res){
  req.flash('success','Your Response has been submitted' ) ;
  res.send("Aloha Routing") ;
}) ;


router.get('/sbi',function(req,res){
  
   var url = "mongodb://jimmy:jimmy51997@ds263740.mlab.com:63740/db_bank" ;
  MongoClient.connect(url,function(err,db){
     if(err) throw err ;
      var dbo = db.db("db_bank") ;   
 //including the branchlist in br_list select input
 // the list rendered from here is list

      dbo.collection("t_sbi_desig").find({}).toArray(function(err,result){
          list = result ;
      }) ;
      
 //including the designation mapping in desig select input
 //the list rendered from here is list2
      dbo.collection("t_sbi_branchlist").find({}).toArray(function(err,result){
          list2 = result ;
          res.render('index_sbi',{ list: list, list2: list2  }) ;
      }) ;
       
  }) ;
  //res.send("Hello world") ;
}) ;

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


module.exports = router ;