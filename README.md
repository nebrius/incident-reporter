Incident Reporter
=================

Incident reporting system and hotline for events using Twilio.

If you run an event, you should have a [Code of Conduct](http://www.ashedryden.com/blog/codes-of-conduct-101-faq), and if you have a Code of Conduct, you should have contact information. Event email is simple to set up, but getting a phone system that provides text-to-many capabilities while keeping organizers phone numbers private isn't quite so simple.

This module provides the server setup necessary to work with Twilio to provide text and voice forwarding to organizers.

## Installation

```Bash
npm install -g incident-reporter
```

## Configuration

Create a configuration file at ```/etc/incident-reporter/config.json```. You can start by copying the [example configuration file](config.example.json).

It is recommended that you run this server behind a web server such as nginx. For nginx, add this to your config inside a server declaration:

```
location /twilio/ {
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $http_host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_pass http://localhost:8000/;
  proxy_set_header Host $host;
  proxy_buffering off;
}
```

Then, in your Twilio phone configuration through their website, set the following urls:
- Voice Request URL: ```http(s)://<your server here>/twilio/voice/```
- Messaging Request URL: ```http(s)://<your server here>/twilio/sms/```

## Running

You can run it with ```incident-reporter``` if you like, but using a process manager like [pm2](https://github.com/Unitech/pm2) is recommended. This is only designed to run on *nix systems (sorry Windows).

License
=======

The MIT License (MIT)

Copyright (c) 2015 Bryan Hughes bryan@theoreticalideations.com (https://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
