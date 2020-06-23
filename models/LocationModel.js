var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var LocationSchema = new mongoose.Schema({   
  
  Name: String,

});
LocationSchema.plugin(timestamps);
mongoose.model('Location', LocationSchema);

module.exports = mongoose.model('Location');