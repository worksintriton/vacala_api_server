var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var MechanicbookingModel = require('./../models/MechanicbookingModel');
const randomstring = require('randomstring');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create', [
    check('Customer_Name').not().isEmpty().isAlpha().exists({ checkFalsy: true }).withMessage("Not a valid Name"),
    check('Customer_Phone').not().isEmpty().isLength({ min: 10 }).isDecimal().withMessage("Please upload a Image"),
    check('Customer_Email').not().isEmpty().withMessage("Please provide valid Description"),
    check('Services').not().isEmpty().withMessage("Please select the service"),
    //check('Vehicle_Id').not().isEmpty().withMessage("Please select the Vehicle"),
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     var Unique_Code = randomstring.generate(7);
     await MechanicbookingModel.create({
           Customer_Name : req.body.Customer_Name || "",
           Customer_id:req.body.Customer_id  || "",
           Customer_Phone : req.body.Customer_Phone  || "",
           Customer_Address : req.body.Customer_Address  || "",
           Customer_Email : req.body.Customer_Email || "",
           Services : req.body.Services || "",
           Subserivces: req.body.Subserivces || "",
           Vehicle_Id:req.body.Vehicle_Id || "",
           Pickup_Date : req.body.Pickup_Date || "",
           Pickup_Time : req.body.Pickup_Time || "",
           Delivery_Time : req.body.Delivery_Time || "",
           Delivery_Date : req.body.Delivery_Date || "",
           Vehicle_Type: req.body.Vehicle_Type || "",
           Vehicle_No: req.body.Vehicle_No || "",
           Lubricant_type:req.body.Lubricant_type || "",
           Mechanic_Name:req.body.Mechanic_Name || "",
           Mechanic_id:req.body.Mechanic_id || "",
           Mechanic_Phone:req.body.Mechanic_Phone || "",
           Pick_up:req.body.Pick_up || "",
           Payment:req.body.Payment || "",
           Token_Status:req.body.Token_Status || "",
           Vehiclepickup_Status:req.body.Vehiclepickup_Status || "",
           Vehicledelivery_Status:req.body.Vehicledelivery_Status || "",
           Vehicleservice_Status: req.body.Vehicleservice_Status || "",
           OTP:req.body.OTP || "",
           Vechicle_Pickup_Images: req.body.Vechicle_Pickup_Images || "",
           Vehicle_Garage_Images: req.body.Vehicle_Garage_Images || "",
           Unique_Code:req.body.Unique_Code || "",
           Token_Age:req.body.Token_Age || "",
           Booking_Status:req.body.Booking_Status || "",
           Current_Booking_Status:req.body.Current_Booking_Status || "",
           TAT: req.body.TAT,
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

router.get('/getlist', function (req, res) {
        MechanicbookingModel.find({}, function (err, Servicebookingdetails) {
           if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicebookingdetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/individuallist', function (req, res) {
        MechanicbookingModel.find({Customer_id:req.body.Customer_id}, function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});
router.post('/status', function (req, res) {
        MechanicbookingModel.findByIdAndUpdate(req.body.Servicebooking_id,req.body, {new: true} ,function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.post('/edit', function (req, res) {
        MechanicbookingModel.findByIdAndUpdate(req.body.Servicebooking_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Servicebookingdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      MechanicbookingModel.findByIdAndRemove(req.body.Servicebooking_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicebooking Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes',  function (req, res) {
      MechanicbookingModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Servicebooking Deleted successfully", Data : {} ,Code:200});
      });
});

module.exports = router;