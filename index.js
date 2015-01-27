var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

var voiceData = fs.readFileSync(path.join(__dirname, 'voice.xml')).toString();
var smsData = fs.readFileSync(path.join(__dirname, 'sms.xml')).toString();

app.post('/voice/', function (req, res) {
  res.send(voiceData);
});

app.post('/sms/', function (req, res) {
  res.send(smsData);
});

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('NodeBots SF incident reporting system listening at http://%s:%s', host, port);
});
