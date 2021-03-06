/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START gae_flex_sendgrid]
'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// The following environment variables are set by app.yaml (app.flexible.yaml or
// app.standard.yaml) when running on Google App Engine,
// but will need to be manually set when running locally.
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_SENDER = process.env.SENDGRID_SENDER;
const Sendgrid = require('sendgrid')(SENDGRID_API_KEY);

const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse form data
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/hello', (req, res, next) => {
  const sgReq = Sendgrid.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [{
        to: [{ email: req.body.email }],
        subject: 'Hello World!'
      }],
      from: { email: SENDGRID_SENDER },
      content: [{
        type: 'text/plain',
        value: 'Sendgrid on Google App Engine with Node.js.'
      }]
    }
  });

  Sendgrid.API(sgReq, (err) => {
    if (err) {
      next(err);
      return;
    }
    // Render the index route on success
    res.render('index', {
      sent: true
    });
  });
});

if (module === require.main) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}

module.exports = app;
// [END gae_flex_sendgrid]
