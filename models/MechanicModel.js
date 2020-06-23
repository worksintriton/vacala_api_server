var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var MechanicSchema = new mongoose.Schema({   
  
  Name: String,
  Gender:String,
  Email: String,
  Password: String,
  DOB: Date,
  loc: {
   type: { type: String },
   coordinates: []
  },
  Primary_Contact : Number,
  Secondary_Contact : Number,
  Residence_Address : String,
  Permanent_Address : String,
  Address_Proof : String,
  Adhaar_Card : String,
  Voter_ID : String,
  Original_Driving_License : String,
  DL_No : String,
  Valid_Upto : String,
  Nominee_Name : String,
  Nominee_Address : String,
  Nominee_Contact : String,
  Reference_Name : String,
  Reference_Address : String,
  Reference_Contact: String,
  Education_Qualification: String,
  Last_employer_name: String,
  Technician_Level: String,
  Service_Category: String,
  Brand_expertise: String,
  Tools_Available: Array,
  Bike: String,
  Scanning_device: String,
  Car_models_Known_to_service: Array,
  OTP: String

});

MechanicSchema.index({ "loc": "2dsphere" });
MechanicSchema.plugin(timestamps);
mongoose.model('Mechanic', MechanicSchema);

module.exports = mongoose.model('Mechanic');