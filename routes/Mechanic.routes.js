var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MechanicModel = require('./../models/MechanicModel');
var DriverModel = require('./../models/DriverModel');
var RM = require('random-number');
const requestss = require("request");
var VerifyToken = require('./VerifyToken');
var MechanicbookingModel = require('./../models/MechanicbookingModel');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    check('Name').not().isEmpty().isAlpha().withMessage("Not a valid Name"),
    check('Primary_Contact').not().isEmpty().isLength({ min: 10 }).isDecimal().withMessage("Please upload a Image"),
    check('DL_No').not().isEmpty().withMessage("Please provide valid Description"),
  ], async function(req, res) {
  try{
    var lat = req.body.lat;
    var long = req.body.long;
    var Mechanicexistance = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact});
    var Driverexistance = await DriverModel.findOne({Primary_Contact:req.body.Primary_Contact});
    console.log(Mechanicexistance)
  if (Mechanicexistance!== null) {
    res.json({Status:"Failed",Message:"Phone number already registered", Data :{},Code:300});
  }
  else if(Driverexistance!== null){
     res.json({Status:"Failed",Message:"Phone number already registered", Data :{},Code:300});
  }
  else{
      await MechanicModel.create({
          Name: req.body.Name,
          Gender:req.body.Gender,
          Email: req.body.Email,
          Password: req.body.Password,
          DOB: req.body.DOB,
          loc: { type: "Point", coordinates: [lat, long ] },
          Primary_Contact : req.body.Primary_Contact,
          Secondary_Contact : req.body.Secondary_Contact,
          Residence_Address : req.body.Residence_Address,
          Permanent_Address : req.body.Permanent_Address,
          Address_Proof : req.body.Address_Proof,
          Adhaar_Card : req.body.Adhaar_Card,
          Voter_ID : req.body.Voter_ID,
          Original_Driving_License : req.body.Original_Driving_License,
          DL_No : req.body.DL_No,
          Valid_Upto : req.body.Valid_Upto,
          Nominee_Name : req.body.Nominee_Name,
          Nominee_Address : req.body.Nominee_Address,
          Nominee_Contact : req.body.Nominee_Contact,
          Reference_Name : req.body.Reference_Name,
          Reference_Address : req.body.Reference_Address,
          Reference_Contact: req.body.Reference_Contact,
          Education_Qualification: req.body.Education_Qualification,
          Last_employer_name: req.body.Last_employer_name,
          Technician_Level: req.body.Technician_Level,
          Service_Category: req.body.Service_Category,
          Brand_expertise: req.body.Brand_expertise,
          Tools_Available: req.body.Tools_Available,
          Bike: req.body.Bike,
          Scanning_device: req.body.Scanning_device,
          Car_models_Known_to_service: req.body.Car_models_Known_to_service,
          OTP:req.body.OTP || ""
        },
        function (err, user) {
          console.log(user)
          res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
  }        
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/login',  async function(req, res) {
      try{
    console.log("request...",req.body);
    var options = {
      min:  1000,
      max: 10000,
      integer: true
    }
    var Datacheck = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact});
    console.log(RM(options));
    var OTP = RM(options);
    if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid User Account", Data : {},Code:401});
    }else
    {
      const filter = { Primary_Contact: req.body.Primary_Contact};
      const update = { OTP: OTP };
      let Data = await MechanicModel.findOneAndUpdate(filter, update, {new: true});
      var json = "";
        var username = "tritonitsolutionstrans";
        var password = 20145;
        var mobilno = req.body.Primary_Contact;
        var message =
          "Hi, Your OTP is " + OTP + ". My Vacala OTP for login.";
        // var dumbell = "DUMBELL";
        var dumbell = "VOXITW";
        var tye = 0;
        var baseurls ="http://www.smsintegra.com/" +"api/smsapi.aspx?uid=" + username + "&pwd=" +password + "&mobile=" + mobilno +
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
      res.json({Status:"Success",Message:"Login Successful", Data : {OTP},Code:200});
    }  
 }
   catch(e){
        console.log(e)
       res.json({Status:"Failed",Message:"Internal server issue", Data :{},Code:500});
     }    
  });

router.post('/otpverify', async function (req, res) {
  
       var Datacheck = await MechanicModel.findOne({Primary_Contact:req.body.Primary_Contact,OTP:req.body.OTP});
       if(Datacheck == null){
     res.json({Status:"Failed",Message:"Invalid OTP", Data :{},Code:300});
    }else
    {
      res.json({Status:"Success",Message:"Login Successful", Data : {Datacheck} ,Code:200});
      }
        });


router.get('/getlist', function (req, res) {
  
        MechanicModel.find({}, function (err, Mechanicdetails) {
          res.json({Status:"Success",Message:"Mechanicdetails", Data : Mechanicdetails ,Code:200});
        });
});

router.get('/bookinglist', function (req, res) {
  
        MechanicbookingModel.find({}, function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/view', function (req, res) {
  
        MechanicModel.findById(req.body.Mechanic_id, function (err, Mechanicdetails) {
          res.json({Status:"Success",Message:"Mechanicdetails", Data : Mechanicdetails ,Code:200});
        });
});


router.put('/edit' ,function (req, res) {
        MechanicModel.findByIdAndUpdate(req.body.Mechanic_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Mechanicdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MechanicModel.findByIdAndRemove(req.body.Mechanic_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mechanic Deleted successfully", Data : {} ,Code:200});
      });
});
router.delete('/deletes', function (req, res) {
      MechanicModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Mechanic Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;