var express = require('express');
var router = express.Router();
const requestss = require("request");
const jwt = require('jsonwebtoken');
var RM = require('random-number');
var bodyParser = require('body-parser');
var ForgotMailer = require('./../helpers/email.helper');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var UserModel = require('./../models/UserModel');
var CustomerModel = require('./../models/CustomerModel');
var DriverModel = require('./../models/DriverModel');
var MechanicModel = require('./../models/MechanicModel');
var EmployeeModel = require('./../models/EmployeeModel');
var PermissionModel = require('./../models/PermissionModel');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/register',[
    check('Email').not().isEmpty().isEmail().withMessage("Not a valid email"),
    check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number")
  ], async function(req, res) {
  try{
  	const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message:errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
    else{
     var UserModelCheck = await UserModel.findOne({Email:req.body.Email});
     var CustomerModelCheck = await CustomerModel.findOne({Email:req.body.Email});
     if(UserModelCheck != null || CustomerModelCheck!= null){
           res.json({Status:"Failed",Message:"Email id already exists", Data : {},Code:300}); 
        }
        else{
          UserModel.create({
          Name : req.body.Name,
          Email : req.body.Email,
          Phone : req.body.Phone,
          Type: req.body.Type,
          Password:req.body.Password,
        },
async function (err, user) {
           if (err) return res.json({Status:"Failed",Message:"There was a problem in registering. Try again", Data : user,Code:300});
    else{
       if(req.body.Type == 0){
        res.json({Status:"Success",Message:"Registration Done successfully", Data : user ,Code:200});
       }
       else if(req.body.Type == 1)
       {
        var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
     var OTP = RM(options);
         var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Phone;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
        console.log(baseurls);
        requestss(baseurls, { json: true }, async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          else{
             let fields ={    
           Email:req.body.Email || "",
           Type:req.body.Type || "",
           Password:req.body.Password || "",
           Address : req.body.Address || "",
           Phone : req.body.Phone || "",
           Profile_Pic : req.body.Profile_Pic || "",
           OTP : OTP
        }
        var CustomerData = await CustomerModel.create(fields);
        res.json({Status:"Success",Message:"OTP has been sent successfully for the registred mobile number", Data : {OTP : OTP} ,Code:200});
          }
        });
       
       }
       else if(req.body.Type == 2){
        let driverfields ={
           Name : req.body.Name || "",
           Gender : req.body.Gender || "",
           Email:req.body.Email || "",
           Type:req.body.Type || "",
           Password:req.body.Password || "",
           Address_Proof : req.body.Address_Proof || "",
           Primary_Contact : req.body.Primary_Contact || "",
           Adhaar_Card : req.body.Adhaar_Card || "",
        }
        var DriverData = await DriverModel.create(driverfields);
        res.json({Status:"Success",Message:"Registration Done successfully", Data :DriverData ,Code:200});
       }
        } 
     });
    }
    }  
  }
  catch(e){
     res.json({Status:"Failed",Message:"Internal Server Error", Data :{},Code:500});
   }    
});

router.post('/registerotpverify',[
    check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number"),
    check('OTP').not().isEmpty().withMessage("Please provide valid Details")
  ], async function (req, res) {
    try{
       const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
    var Datacheck = await CustomerModel.findOne({Phone:req.body.Phone,OTP:req.body.OTP});
    if(Datacheck == null){
    res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
     }
else
    {
    res.json({Status:"Success",Message:"Regsitration Successful", Data :Datacheck ,Code:200});
   }
 }
    catch(e){
       res.json({Status:"Failed",Message:"Internal server error", Data :{},Code:300});
    }
});


router.post('/login',  async function(req, res) {
      try{
    var password = req.body.Password;
    var Datacheck = await UserModel.findOne({Email:req.body.Email});
    console.log(Datacheck);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Email id not found", Data : {},Code:401});
    }
    const validate = await Datacheck.isValidPassword(password);
        if (!validate) {
        return res.json({Status:"Failed",Message:"Incorrect password", Data : {},Code:401});
         }
    else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Email }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck
                    }
      res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }  
  }
  catch(e){
       console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/login',  async function(req, res) {
      try{
    var password = req.body.Password;
    var Datacheck = await UserModel.findOne({Email:req.body.Email});
    console.log(Datacheck);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Email id not found", Data : {},Code:401});
    }
    const validate = await Datacheck.isValidPassword(password);
        if (!validate) {
        return res.json({Status:"Failed",Message:"Incorrect password", Data : {},Code:401});
         }
    else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Email }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck
                    }
      res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }  
  }
  catch(e){
       console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/employeelogin',async function(req, res) {
      try{
    var password = req.body.Password;
    var Datacheck = await EmployeeModel.findOne({Email_Id:req.body.Email_Id});
    var Permissions = await PermissionModel.findOne({Employee_Email_Id:req.body.Email_Id});
    console.log(Datacheck);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Email id not found", Data : {},Code:401});
    }
    const validate = await Datacheck.isValidPassword(password);
        if (!validate) {
        return res.json({Status:"Failed",Message:"Incorrect password", Data : {},Code:401});
         }
    else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Email }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck,
                        Permissions: Permissions
                    }
      res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }  
  }
  catch(e){
       console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });
router.post('/customerlogin',[
    check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number")
  ],async function(req, res) {
      try{
          const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
    console.log("request...",req.body);
    var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
    var Datacheck = await CustomerModel.findOne({Primary_Contact:req.body.Primary_Contact});
    console.log(RM(options));
    var OTP = RM(options);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:300});
    }else
    {
      const filter = { Primary_Contact: req.body.Primary_Contact};
      const update = { OTP: OTP };
      let Data = await CustomerModel.findOneAndUpdate(filter, update, {new: true});
      var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Primary_Contact;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls =
          "http://www.smsintegra.com/" +
          "api/smsapi.aspx?uid=" +
          username +
          "&pwd=" +
          password +
          "&mobile=" +
          mobilno +
          "&msg=" +
          message +
          "&sid=" +
          dumbell +
          "&type=" +
          tye;
        console.log(baseurls);
        requestss(baseurls, { json: true }, (err, res, body) => {
          if (err) {
            return console.log(err);
          }
        });
      res.json({Status:"Success",Message:"Login Successful", Data : OTP  ,Code:200});
    }  
 }
   catch(e){
        console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/customerotpverify', [
    check('Phone').not().isEmpty().isLength({ min: 10 }).withMessage("Not a valid Phone number"),
    check('OTP').not().isEmpty().withMessage("Please provide valid Details")
  ], async function (req, res) {
    try{
      const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
     }
    var Datacheck = await CustomerModel.findOne({Primary_Contact:req.body.Primary_Contact,OTP:req.body.OTP});
    if(Datacheck == null){
    res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
     }
else
    {
      const jwtToken = process.env.JWT_SECRET;
      const token = jwt.sign({ user: req.body.Primary_Contact }, jwtToken);
      console.log("USer Token", token);
      let responseData = {
                        token: token,
                        user: Datacheck,
                    }
    res.json({Status:"Success",Message:"Login Successful", Data : responseData ,Code:200});
    }
    }
    catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
    }
});

router.post('/driverlogin',  async function(req, res) {
      try{
    var Datacheck = await DriverModel.findOne({Email:req.body.Email,Password:req.body.Password});
    console.log(Datacheck);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:300});
    }else
    {
      res.json({Status:"Success",Message:"Login Successful", Data : Datacheck,Code:200});
    }  
 }
   catch(e){
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/forgotpassword', async function(req, res) {
      UserModel.findOne({ Email: req.body.Email }, async function (err, user) {
        if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
        if (!user){
         res.json({Status:"Failed",Message:"Invalid Email Id. Enter registered Email id", Data : {},Code:300});
        } 
        else{
        data={
          password: user.Password,
        };
        let mail = await ForgotMailer.sendEmail(req.body.Email, "Password for VACALA","addUser", data);
        res.json({Status:"Success",Message:"Password has been sent to your registered Email Id", Data :{} ,Code:200});
       }    
  });
});

router.get('/getlist', function (req, res) {
        UserModel.find({}, function (err, users) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500}); 
             res.json({Status:"Success",Message:"Userdetail list", Data : users ,Code:200});     
        });
});

router.put('/edit', function (req, res) {
        UserModel.findByIdAndUpdate(req.body.User_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
            if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
             res.json({Status:"Success",Message:"Mechanicdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.post('/delete', function (req, res) {
      UserModel.findByIdAndRemove(req.body.user_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Admin User Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;