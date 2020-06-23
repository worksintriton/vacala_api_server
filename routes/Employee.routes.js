var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var EmployeeModel = require('./../models/EmployeeModel');
var PermissionModel = require('./../models/PermissionModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',VerifyToken, async function(req, res) {
  try{
    var EmployeeCheck = await EmployeeModel.findOne({Email_Id:req.body.Email_Id});
     if(EmployeeCheck != null){
           res.json({Status:"Failed",Message:"Email id already exists", Data : {},Code:300}); 
        }
        else{
          let employeefields = {
          "Employee_Name" : req.body.Employee_Name,
          "Email_Id" : req.body.Email_Id,
          "Password": req.body.Password,
          "Phone":req.body.Phone,
          "Role_Id":req.body.Role_Id,
          "Profile_Image":req.body.Profile_Image,
          "Employee_Id":req.body.Employee_Id
          }
           var employeedetails = await EmployeeModel.create(employeefields); 
          let fields = {
            Dashboard: req.body.Dashboard,
            VendorManagement:req.body.VendorManagement,
            AppManagement:req.body.AppManagement,
            Bookings:req.body.Bookings,
            Finance:req.body.Finance,
            CustomerCare:req.body.CustomerCare,
            Statatics:req.body.Statatics,
            Employee_Email_Id:req.body.Email_Id
          }
          var permissions = await PermissionModel.create(fields);
          let responseData = {
            user: employeedetails,
            permissions: permissions
          }
        res.json({Status:"Success",Message:"Added successfully", Data : responseData,Code:200});       
}
}
catch(e){
  console.log(e)
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/getlist', VerifyToken, function (req, res) {
  
        EmployeeModel.find({}, function (err, Employeedetails) {
          res.json({Status:"Success",Message:"Employeedetails", Data : Employeedetails ,Code:200});
        });
});

router.put('/edit', VerifyToken, function (req, res) {
        EmployeeModel.findByIdAndUpdate(req.body.Employee_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Employeedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});

router.put('/editpermissions', VerifyToken, function (req, res) {
        PermissionModel.findOneAndUpdate(req.body.Employee_Email, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Employeedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete',VerifyToken, function (req, res) {
      EmployeeModel.findByIdAndRemove(req.body.Employee_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Employee Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', VerifyToken, function (req, res) {
      EmployeeModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Employees Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;