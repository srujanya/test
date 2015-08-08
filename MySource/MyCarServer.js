var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mycarusers');

var userSchema = mongoose.Schema({
	fname: String,
	lname: String,
	email: String,
	password: String
});
var usermodel = mongoose.model('usermodel', userSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));
db.once('open', function (callback) {
  // mongoDB opened successfully
});


app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "home.html" );
})

 app.get(/^(.+)$/, function(req, res){ 
     res.sendFile( __dirname + req.params[0]); 
 });

app.post('/doLogin', urlencodedParser, function (req, res) {

   var em = req.body.userName;
   var pwd = req.body.password;	
   usermodel.find({email:em}, function(err, user){
		if(err)
			return console.error(err);
		if(user.length > 0 && em === user[0].email && pwd === user[0].password)
		{
		   console.log('login successful');
		   res.statusCode = 302;
		   res.setHeader("Location", '/a.htm');
		   res.end();
		} else {
		   //Wrong user name Or password.
		   console.log('login unsuccessful');
		   res.statusCode = 302;
		   res.setHeader("Location", '/loginUnsuccessful.htm');
		   res.end();
		}
	})
})

app.post('/doRegister', urlencodedParser, function (req, res) {
	   res.statusCode = 302;
	   res.setHeader("Location", '/registration.htm');
	   res.end();
	
})


app.post('/joinMe', urlencodedParser, function (req, res) {
	var fn = req.body.fname;
	var ln = req.body.lname;
	var em = req.body.email;
	var pwd = req.body.password;
	usermodel.find({email:em}, function(err, user){
		if(err)
			return console.error(err);
		if(user.length > 0)
		{
		   console.log('User already registered. Use another email account.');
		   res.statusCode = 302;
		   res.setHeader("Location", '/');
		   res.end();
		} else {
			var u1 = new usermodel({fname: fn, lname:ln, email: em, password:pwd});
			u1.save(function (err, u1){
			  if(err) return console.error(err);
			});
			res.statusCode = 302;
			res.setHeader("Location", '/a.htm');
			res.end();
		}
	})

})

var server = app.listen(8081, function () {

  console.log("app started listening")

})