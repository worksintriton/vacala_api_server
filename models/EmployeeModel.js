var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
const bcrypt = require('bcrypt');

var EmployeeSchema = new mongoose.Schema({   
  
  Employee_Name: String,

  Email_Id: String,

  Password: String,

  Phone: Number,

  Role_Id: String,

  Profile_Image: String,

  Employee_Id: String,

});

EmployeeSchema.pre('save', async function(next) {
    const user = this;
    var hash = '';
    if (user.Password != "") {
        hash = await bcrypt.hash(this.Password, 10);
    }
    this.Password = hash;
    next();
});

EmployeeSchema.methods.isValidPassword = async function(Password) {
    const user = this;
    if (user.password == "") {
        return false;
    }
    const compare = await bcrypt.compare(Password, user.Password);
    return compare;
};
EmployeeSchema.plugin(timestamps);
mongoose.model('Employee', EmployeeSchema);

module.exports = mongoose.model('Employee');