var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var MasterServiceSchema = new mongoose.Schema({   
  Masterservice_Name: String,
  Service_Name: String,
  Service_Image: String,
  Desc: String
});

MasterServiceSchema.plugin(timestamps);
mongoose.model('MasterService', MasterServiceSchema);

module.exports = mongoose.model('MasterService');