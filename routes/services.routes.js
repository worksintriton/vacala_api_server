var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var ServiceModel = require('./../models/ServiceModel');
var VerifyToken = require('./VerifyToken');
const { check, validationResult } = require('express-validator');

router.post('/create',[
    check('Service_Name').not().isEmpty().isAlpha().withMessage("Not a valid Name"),
    check('Master_Service_id').not().isEmpty().withMessage("Please provide valid Details"),
    check('Desc').not().isEmpty().withMessage("Please provide valid Description"),
  ], async function(req, res) {
  try{
     const errors = validationResult(req);
      console.log(errors)
      if (!errors.isEmpty()) {
      return res.json({Status:"Failed",Message: errors.array(), Data :[],Code:422});
       //res.status(422).jsonp(errors.array());
    }
     await ServiceModel.create({
          Service_Name : req.body.Service_Name,
          Master_Service_id:req.body.Master_Service_id || "",
          Service_Image : req.body.Service_Image,
          Desc : req.body.Desc,
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

router.post('/getlist', async function (req, res) {
        await ServiceModel.find({Master_Service_id:req.body.Master_Service_id}, function (err, Servicedetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(Servicedetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Servicedetails", Data : Servicedetails ,Code:200});
        });
});

router.get('/locationlist', async function (req, res) {
        LocationModel.find({}, function (err, Locationdetails) {
          if(err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});
router.put('/edit', async function (req, res) {
        await ServiceModel.findByIdAndUpdate(req.body.Service_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             if(UpdatedDetails == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
             res.json({Status:"Success",Message:"Servicedetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', async function (req, res) {
      await ServiceModel.findByIdAndRemove(req.body.Service_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
           if(user == ""){
            return res.json({Status:"Failed",Message:"No data Found", Data : {},Code:404});
           }
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});

router.delete('/deletes', function (req, res) {
      ServiceModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Service Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;