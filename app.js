var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cmd = require('node-cmd');
var cors = require('cors');
var bodyParser = require('body-parser');
require('dotenv').config({path: path.join(__dirname, "./.env")});

var usersRouter = require('./routes/User.routes');
var DriverRouter = require('./routes/Driver.routes');
var MechanicRouter = require('./routes/Mechanic.routes');
var VehicleRouter = require('./routes/Vehicle.routes');
var ServiceRouter = require('./routes/services.routes');
var SubserviceRouter = require('./routes/Subservice.routes');
var CustomerRouter = require('./routes/Customer.routes');
var BookingRouter = require('./routes/Mechanicbooking.routes');
var LocationRouter = require('./routes/Location.routes');
var VehicletypeRouter = require('./routes/Vehicletype.routes');
var DriverBookingRouter = require('./routes/Driverbooking.routes')
var ParkingRouter = require('./routes/Parking.routes');
var MechanicwebRouter = require('./routes/mechanicweb.routes');
var PaymentRouter = require('./routes/Payment.routes');
var RoleRouter = require('./routes/Role.routes');
var MasterserviceRouter = require('./routes/Masterservices.routes')
var EmployeeRouter = require('./routes/Employee.routes');
var EstimationRouter = require('./routes/Estimation.routes');
var PickupboyRouter = require('./routes/pickup.routes');
var schedule = require('node-schedule');
/* DB connectivity */
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/myvacala'); 
var db = mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

var app = express();
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type,Content-Length, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/driver', DriverRouter);
app.use('/mechanic', MechanicRouter);
app.use('/vehicle', VehicleRouter);
app.use('/service', ServiceRouter);
app.use('/subservice',SubserviceRouter);
app.use('/customer',CustomerRouter);
app.use('/booking',BookingRouter);
app.use('/location',LocationRouter);
app.use('/vehicletype',VehicletypeRouter);
app.use('/driverbooking',DriverBookingRouter);
app.use('/parking',ParkingRouter);
app.use('/mechanicweb',MechanicwebRouter);
app.use('/payment',PaymentRouter);
app.use('/employee',EmployeeRouter);
app.use('/role',RoleRouter);
app.use('/estimation',EstimationRouter);
app.use('/masterservices',MasterserviceRouter);
app.use('/pickupboy',PickupboyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// var j = schedule.scheduleJob(('0 0 * * *', function(){
// cmd.run('./backup.bat');
// console.log("Command is running successfully")
// });

// schedule.scheduleJob(' */1 * * * *', async () => { 
// await cmd.get(
//     'backup.bat',
//      function(err,data){
//         console.log(err);
//         console.log('the current working dir is : ',data);
//     }
// );
// console.log("Command is running successfully") })

schedule.scheduleJob(' */1 * * * *', async () => { 
await cmd.get(
    'backup.bat',
     function(err,data){
        console.log(err);
        console.log('the current working dir is : ',data);
    }
);
console.log("Command is running successfully") })
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
