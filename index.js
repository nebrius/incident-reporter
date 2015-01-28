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
var mu = require('mu2');
var async = require('async');
var app = express();

var config = JSON.parse(fs.readFileSync('/etc/nodebotssf/config.json').toString());

mu.root = path.join(__dirname, 'templates');
async.parallel({
  voice: function(next) {
    var text = '';
    var renderStream = mu.compileAndRender('voice.xml', config);
    renderStream.on('data', function(data) {
      text += data.toString();
    });
    renderStream.on('end', function() {
      next(null, text);
    });
  },
  sms: function(next) {
    var text = '';
    var renderStream = mu.compileAndRender('sms.xml', config);
    renderStream.on('data', function(data) {
      text += data.toString();
    });
    renderStream.on('end', function() {
      next(null, text);
    });
  }
}, function (err, results) {

  app.post('/voice/', function (req, res) {
    res.send(results.voice);
  });

  app.post('/sms/', function (req, res) {
    res.send(results.sms);
  });

  var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('NodeBots SF incident reporting system listening at http://%s:%s', host, port);
  });
});
