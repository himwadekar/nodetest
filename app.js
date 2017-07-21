var express = require('express');
var mysql = require('mysql');
//var main = require('./controllers/main');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
app.set('view engine', 'ejs');



//connect to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node1'
});

connection.connect(function(error){
  if (!!error) {
    console.log('error');
  }
  else {
    console.log('connected');
  }
});

//Set up template engine
app.set('view engine', 'ejs');

//Static files ie. images and css files
app.use(express.static('./public'));

//fire controllers
// main(app);

//listen to ports
app.listen(3000);
console.log('you are listning to port 3000');


//

//get
app.get('/', function(req, res){
  res.render('index');
});
app.get('/login', function(req, res){
  console.log('login is running');
  var data = {
    status : ''
  }
  res.render('login', {data : data});
});

app.get('/signup', function(req, res){
  console.log('signup is running');
  res.render('signup');
});


//post

app.post('/login', urlencodedParser, function(req,res){
  console.log(req.body);

  var email= req.body.email;
  var password = req.body.password;
  connection.query('SELECT * FROM user WHERE email = ?', email, function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    var data = {
      status : 'Error Occured'
    }
    res.render('login', {data : data});
  }else{
    console.log('The solution is: ', results);
    if(results.length >0){
      for (var i = 0; i < results.length; i++) {
        if(results[i].password === password){
          var data = {
            name : results[i].name,
            email : results[i].email
          }
          res.render('profile', {data : data});
          // res.send({
          //   "code":200,
          //   "success":"login sucessful"
          //     });
          break;
        }
        else{
          if(i === results.length-1)
          {
            var data = {
              status : 'Email and password does not match'
            }
            res.render('login', {data : data});
          }

        }


      }


    }
    else{
      var data = {
        status : 'Email does not exist'
      }
      res.render('login', {data : data});
    }
  }
  });

  // if(req.body.email === 'him' && req.body.password === '123'){
  //   console.log('profile is running');
  //   res.render('profile');
  // }
  // else{
  //   console.log('login is failed');
  //   res.render('login');
  // }

});

app.post('/signup',urlencodedParser, function(req,res){
  console.log(req.body);
  var insert={
    name : req.body.name,
    email : req.body.email,
    password : req.body.password
  };

  connection.query('insert into user set ?', insert, function (err){
    if (err) {
      console.log('error');
    }
    else{
      console.log('query successful');
      res.render('profile');
    }
  }
  );
});
