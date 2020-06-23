var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var VehicleModel = require('./../models/VehicleModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');
router.post('/create', [
    check('Lubricant_Used').not().isEmpty().isAlpha().withMessage("Please select the fuel type"),
    check('Vehicle_Id').not().isEmpty().withMessage("Please provide valid Details"),
    check('Kilometer_Travelled').not().isEmpty().withMessage("Please provide valid Kilometer_Travelled"),
  ], async function(req, res) {

router.post('/create',VerifyToken, async function(req, res) {

  try{
    const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await VehicleModel.create({
           Customer_id : req.body.Customer_id,
           Vehiclepickup_Status:req.body.Vehiclepickup_Status,
           Vehicle_Id:req.body.Vehicle_Id,
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

router.post('/status',VerifyToken, function (req, res) {
        VehicleModel.findByIdAndUpdate(req.body.Vehicle_id,req.body, {new: true} ,function (err, Servicebookingdetails) {
          res.json({Status:"Success",Message:"Servicebookingdetails", Data : Servicebookingdetails ,Code:200});
        });
});

router.get('/getlist', VerifyToken,function (req, res) {
        VehicleModel.find({}, function (err, Vehicledetails) {
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.post('/cvehiclelist',VerifyToken, function (req, res) {

        VehicleModel.find({Customer_id:req.body.Customer_id}, function (err, Vehicledetails) {
           if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Vehicledetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
          res.json({Status:"Success",Message:"Vehicledetails", Data : Vehicledetails ,Code:200});
        });
});

router.put('/edit', VerifyToken,function (req, res) {
        VehicleModel.findByIdAndUpdate(req.body.Vehicle_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
             res.json({Status:"Success",Message:"Vehicledetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE

router.post('/delete', VerifyToken,function (req, res) {
      VehicleModel.findByIdAndRemove(req.body.Vehicle_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : [],Code:404});
           }
          res.json({Status:"Success",Message:"Vehicle Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', VerifyToken,function (req, res) {
      VehicleModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Vehicles Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;