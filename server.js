'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 

let id = 0;
let linksDatabase = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.post("/api/shorturl/new", function (req, res) {
  
  let { url } = req.body;
  let reg = /^https?:\/\//i;
  let newURL = url.replace(reg, '');
  
  dns.lookup(newURL, (err) => {
    if(err){
      return res.json({
        "error": 'invalid URL'
    })
    }else{
      id++;
      linksDatabase[`${id}`] = url;
      return res.json({
        "original_url": newURL,
        "short_url": id
      })
    }
  })
});

app.get("/api/shorturl/:id", (req, res) => {
  let { id } = req.params;
  if(linksDatabase.hasOwnProperty(id)){
    let uniqueLink = linksDatabase[`${id}`];
    res.redirect(uniqueLink);
  }else{
    console.log("that's false");
    return res.json({
      "error": "No URL found"
    })
  }
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});