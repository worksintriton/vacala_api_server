var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

var PermissionSchema = new mongoose.Schema({   
  
  Dashboard: Number,

  VendorManagement: Number,

  AppManagement: Number,

  Bookings: Number,

  Finance: Number,

  CustomerCare: Number,

  Statatics: Number,

  Employee_Email_Id: String

});
PermissionSchema.plugin(timestamps);
mongoose.model('Permission', PermissionSchema);

module.exports = mongoose.model('Permission');