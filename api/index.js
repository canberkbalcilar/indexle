const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

app.post('/api/index', async (req, res) => {
  const urls = req.body.urls;
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'urls alanı zorunlu ve dizi olmalı.' });
  }

  // Çevre değişkenlerinden anahtar bilgilerini al
  const client_email = process.env.GOOGLE_CLIENT_EMAIL;
  const private_key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!client_email || !private_key) {
    return res.status(500).json({ error: 'Google servis hesabı bilgileri eksik.' });
  }

  const jwtClient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  );

  jwtClient.authorize(function(err, tokens) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const items = urls.map(line => {
      return {
        'Content-Type': 'application/http',
        'Content-ID': '',
        body:
          'POST /v3/urlNotifications:publish HTTP/1.1\n' +
          'Content-Type: application/json\n\n' +
          JSON.stringify({
            url: line,
            type: 'URL_UPDATED'
          })
      };
    });

    const options = {
      url: 'https://indexing.googleapis.com/batch',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/mixed'
      },
      auth: { bearer: tokens.access_token },
      multipart: items
    };

    // request paketi yerine fetch veya axios önerilir, ama eski kodu koruyorum
    const request = require('request');
    request(options, (err, resp, body) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({ result: body });
    });
  });
});

module.exports = app; 