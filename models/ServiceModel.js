var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var ServiceSchema = new mongoose.Schema({   
  
  Service_Name: String,
  Master_Service_id: String,
  Service_Image: String,
  Desc: String

});
ServiceSchema.plugin(timestamps);
mongoose.model('Service', ServiceSchema);

module.exports = mongoose.model('Service');