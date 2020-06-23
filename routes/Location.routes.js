var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var LocationModel = require('./../models/LocationModel');
const { check, validationResult } = require('express-validator');

router.post('/create', async function(req, res) {
  try{

        await LocationModel.create({
            
            Location:req.body.Location,
            
        }, 
        function (err, user) {
          console.log(user)
        res.json({Status:"Success",Message:"Added successfully", Data : user ,Code:200}); 
        });
}
catch(e){
      res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
}
});


router.get('/getlist', function (req, res) {
  
        LocationModel.find({}, function (err, Locationdetails) {
          res.json({Status:"Success",Message:"Locationdetails", Data : Locationdetails ,Code:200});
        });
});


router.put('/edit', function (req, res) {
        LocationModel.findByIdAndUpdate(req.body.Location_id, req.body, {new: true}, function (err, UpdatedDetails) {
            if (err) returnres.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
             res.json({Status:"Success",Message:"Locationdetails Updated", Data : UpdatedDetails ,Code:200});
        });
});
// // DELETES A USER FROM THE DATABASE
router.post('/delete', function (req, res) {
      LocationModel.findByIdAndRemove(req.body.Location_id, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
      });
});
router.delete('/deletes', function (req, res) {
      LocationModel.deleteMany({}, function (err, user) {
          if (err) return res.json({Status:"Failed",Message:"Internal Server Error", Data : {},Code:500});
          res.json({Status:"Success",Message:"Location Deleted successfully", Data : {} ,Code:200});
      });
});
module.exports = router;