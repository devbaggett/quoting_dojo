var express = require("express");
var path = require("path");
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// basic_mongoose ends up being our new DB
mongoose.connect('mongodb://localhost/quoting_dojo');

var QuoteSchema = new mongoose.Schema({
 name: {type: String, required: true, minlength: 2},
 quote: {type: String, required: true, minlength: 5}
}, {timestamps: true}, {versionKey: false});

mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'


// use native promises
mongoose.Promise = global.Promise;


app.get('/', function(req, res) {
 	res.render("index");
});


app.post('/quotes', function(req, res) {
  console.log("POST DATA", req.body);
  var quote = new Quote(req.body);
  quote.save(function(err){
    if (err){
      console.log(quote.errors)
      res.render('index', {errors: quote.errors})
    }
    else{
      res.redirect('/display_quotes')
    }
  });
})

app.get('/display_quotes', function(req, res){
  Quote.find({}, function(err, quotes){
      res.render("quotes.ejs", {quotes: quotes, moment: moment})
  })
})


var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});