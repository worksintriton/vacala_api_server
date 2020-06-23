var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var SubserviceSchema = new mongoose.Schema({   
  
  Subservice_Name: String,

  Service_id: String,

  Desc: String,

  SubDesc: Array,

  Time_Taken: String,

  Service_Cost: String,

});
SubserviceSchema.plugin(timestamps);
mongoose.model('Subservice', SubserviceSchema);

module.exports = mongoose.model('Subservice');