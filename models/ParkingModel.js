var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var ParkingSchema = new mongoose.Schema({   
  
  Customer_Name: String,

  Customer_id: String,

  Customer_Phone: Number,

  Vehicle_Type : String,

  Vehicle_Number: String,

  Parking_Location: String,

  Parking_In_Date: Date,

  Parking_Out_Time: String,

  Parking_Out_Date: String,

  Parking_In_Time:Date,

  Charge_per_hour : String,

});
ParkingSchema.plugin(timestamps);

mongoose.model('Parking', ParkingSchema);

module.exports = mongoose.model('Parking');