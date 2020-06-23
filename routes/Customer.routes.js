var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var CustomerModel = require('./../models/CustomerModel');
var ServiceModel = require('./../models/ServiceModel');
var VerifyToken = require('./VerifyToken');
var SubserviceModel = require('./../models/SubserviceModel');
var VehicleModel = require('./../models/VehicleModel');
var LocationModel = require('./../models/LocationModel');
var MasterServiceModel = require('./../models/MasterserviceModel');
var MechanicbookingModel = require('./../models/MechanicbookingModel');
var VehicletypeModel = require('./../models/VehicletypeModel');
const randomstring = require('randomstring');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{
    var customercheck = await CustomerModel.findOne({Email:req.body.Email})
    if(customercheck!== null)
    {
      res.json({Status:"Failed",Message:"Email Id Already exists", Data : {} ,Code:300}); 
    }
    else
    {
     await CustomerModel.create({
           Name : req.body.Name,
           Gender : req.body.Gender,
           DOB : req.body.DOB,
           Email:req.body.Email,
           Type:req.body.Type,
           Password:req.body.Password,
           Address : req.body.Address,
           Phone : req.body.Phone,
           Profile_Pic : req.body.Profile_Pic,
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

router.post('/addvehicle', async function(req, res) {
  try{
     await VehicleModel.create({
           Customer_id : req.body.Customer_id,
           Vehiclepickup_Status:req.body.Vehiclepickup_Status,
           Vehicledelivery_Status:req.body.Vehicledelivery_Status,
           Vehicleservice_Status: req.body.Vehicleservice_Status,
           Vehicle_Image : req.body.Vehicle_Image,
           Vehicle_Name : req.body.Vehicle_Name,
           Vehicle_Type : req.body.Vehicle_Type,
           Vehicle_No : req.body.Vehicle_No,
           Vehicle_Brand : req.body.Vehicle_Brand,
           Vehicle_Model : req.body.Vehicle_Model,
           Lubricant_Used : req.body.Lubricant_Used,
           Year_of_Purchase : req.body.Year_of_Purchase,
           Kilometer_Travelled : req.body.Kilometer_Travelled,
           Vehicle_Unique_Number : req.body.Vehicle_Unique_Number,
        },
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});

router.post('/bookamechanic', async function(req, res) {
  try{
     var Unique_Code = randomstring.generate(7);
     await MechanicbookingModel.create({
           Customer_Name : req.body.Customer_Name,
           Customer_id:req.body.Customer_id,
           Customer_Phone : req.body.Customer_Phone,
           Customer_Address : req.body.Customer_Address,
           Customer_Email : req.body.Customer_Email,
           Services : req.body.Services,
           Subserivces: req.body.Subserivces,
           Pickup_Date : req.body.Pickup_Date,
           Pickup_Time : req.body.Pickup_Time,
           Delivery_Time : req.body.Delivery_Time,
           Delivery_Date : req.body.Delivery_Date,
           Vehicle_Type: req.body.Vehicle_Type,
           Vehicle_No: req.body.Vehicle_No,
           Lubricant_type:req.body.Lubricant_type,
           Mechanic_Name:req.body.Mechanic_Name,
           Mechanic_id:req.body.Mechanic_id,
           Mechanic_Phone:req.body.Mechanic_Phone,
           Pick_up:req.body.Pick_up,
           Payment:req.body.Payment,
           Token_Status:req.body.Token_Status,
           Vehiclepickup_Status:req.body.Vehiclepickup_Status,
           Vehicledelivery_Status:req.body.Vehicledelivery_Status,
           Vehicleservice_Status: req.body.Vehicleservice_Status,
           OTP:req.body.OTP || "",
           Vechicle_Pickup_Images: req.body.Vechicle_Pickup_Images,
           Vehicle_Garage_Images: req.body.Vehicle_Garage_Images,
           Unique_Code:req.body.Unique_Code,
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data :user ,Code:200}); 
    });      
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/vehicletypelist', function (req, res) {
  
        VehicletypeModel.find({}, function (err, Vehicledetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.get('/Mechanicbookinglist', function (req, res) {
        MechanicbookingModel.find({}, function (err, Servicebookingdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.get('/Masterservicelist', function (req, res) {
  
        MasterServiceModel.find({}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});
router.get('/serviceslist', function (req, res) {
  
        ServiceModel.find({}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});

router.post('/subservicelist',  function (req, res) {
  
        SubserviceModel.find({Service_id:req.body.Service_id}, function (err, Servicedetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicedetails with subservices", Data : Servicedetails ,Code:200});
        });
});

router.get('/getlist', function (req, res) {
  
        CustomerModel.find({}, function (err, Customerdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Customerdetails", Data : Customerdetails ,Code:200});
        });
});

router.post('/vehiclelist',function (req, res) {
  
        VehicleModel.find({Customer_id:req.body.Customer_id}, function (err, Vehicledetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.put('/edit', VerifyToken, function (req, res) {
        CustomerModel.findByIdAndUpdate(req.body.Customer_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Customerdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      CustomerModel.findByIdAndRemove(req.body.Customer_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Customer Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      CustomerModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;