var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var CustomerSchema = new mongoose.Schema({   
  
  Name: String,

  Gender:String,

  Email: String,

  Password: String,

  DOB: Date,
  
  Address: String,

  Type: Number,

  Phone: Number,

  Profile_Pic: String,

  Services: String,

  Subservice: Array,

  Pickup_required: String,

  Service_Date: String,

  Service_Time: String,

  Payment : String,

  OTP: String,

});

CustomerSchema.plugin(timestamps);

mongoose.model('Customer', CustomerSchema);

module.exports = mongoose.model('Customer');