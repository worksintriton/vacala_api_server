var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ParkingModel = require('./../models/ParkingModel');
var SupervisorModel = require('./../models/SupervisorModel')
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',VerifyToken, async function(req, res) {
  try{
     await ParkingModel.create({
           Customer_Name : req.body.Customer_Name,
           Customer_id:req.body.Customer_id,
           Customer_Phone : req.body.Customer_Phone,
           Vehicle_Type : req.body.Vehicle_Type,
           Parking_Location : req.body.Parking_Location,
           Parking_In_Date : req.body.Parking_In_Date,
           Parking_Out_Time: req.body.Parking_Out_Time,
           Parking_Out_Date : req.body.Parking_Out_Date,
           Parking_In_Time : req.body.Parking_In_Time,
           Charge_per_hour : req.body.Charge_per_hour,
           Vehicle_Number: req.body.Vehicle_Number
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


router.post('/addsupervisor',VerifyToken, async function(req, res) {
  try{
     await SupervisorModel.create({
           Name : req.body.Name,
           Email:req.body.Email,
           Type : req.body.Type,
           Phone : req.body.Phone,
           Password : req.body.Password,
           Profile_Pic : req.body.Profile_Pic,
           Number_of_parking_booked:req.body.Number_of_parking_booked,
           Parkingslots_availability : req.body.Parkingslots_availability,
           Vehicles_Entered_Bookings : req.body.No_Of_Vehicles_Entered,
           Currently_Inside : req.body.Currently_Inside,
           Vehicles_Outside_Bookings : req.body.Vehicles_Outside_Bookings,
           Customer_id: req.body.Customer_id,
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

router.post('/superlogin',  async function(req, res) {
      try{
    var password = req.body.Password;
    var Datacheck = await SupervisorModel.findOne({Email:req.body.Email});
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

router.get('/getlist',VerifyToken, function (req, res) {
  
        ParkingModel.find({}, function (err, Parkingdetails) {
          res.json({Status:"Success",Message:"Parkingdetails", Data : Parkingdetails ,Code:200});
        });
});


router.post('/individuallist', VerifyToken, function (req, res) {
  
        ParkingModel.find({Customer_id:req.body.Customer_id}, function (err, Parkingdetails) {
          res.json({Status:"Success",Message:"Parkingdetails", Data : Parkingdetails ,Code:200});
        });
});

router.put('/edit', function (req, res) {
        ParkingModel.findByIdAndUpdate(req.body.Parking_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Parkingdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      ParkingModel.findByIdAndRemove(req.body.Parking_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Parking Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      ParkingModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Parking Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;