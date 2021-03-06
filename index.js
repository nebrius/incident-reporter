#!/usr/bin/env node
/*
The MIT License (MIT)

Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var mu = require('mu2');

var config = JSON.parse(fs.readFileSync('/etc/incident-reporter/config.json').toString());

mu.root = path.join(__dirname, 'templates');
var voiceTwiML = '';
var noAnswerTwiML = '';
async.parallel([
  function(next) {
    var renderStream = mu.compileAndRender('voice.xml', config);
    renderStream.on('data', function(data) {
      voiceTwiML += data.toString();
    });
    renderStream.on('end', function() {
      next(null);
    });
  },
  function(next) {
    var renderStream = mu.compileAndRender('no_answer.xml', config.voice);
    renderStream.on('data', function(data) {
      noAnswerTwiML += data.toString();
    });
    renderStream.on('end', function() {
      next(null);
    });
  }
], function() {

  var app = express();

  app.use(bodyParser.urlencoded({ extended: false }));

  app.post('/sms/', function (req, res) {
    var smsTwiML = '';
    var renderStream = mu.compileAndRender('sms.xml', {
      responders: config.sms.responders,
      name: config.organization.name,
      source: req.body.From,
      message: req.body.Body
    });
    renderStream.on('data', function(data) {
      smsTwiML += data.toString();
    });
    renderStream.on('end', function() {
      res.send(smsTwiML);
    });
  });

  app.post('/voice/', function (req, res) {
    res.send(voiceTwiML);
  });

  app.post('/voice_response/', function (req, res) {
    var callStatus = req.body.DialCallStatus;
    if (callStatus != 'completed') {
      res.send(noAnswerTwiML);
    } else {
      res.send('<?xml version="1.0" encoding="UTF-8"?>'); // Blank response...right?
    }
  });

  var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Incident reporting system listening at http://%s:%s', host, port);
  });
});
