'use strict'

require ('dotenv');
const express = require('express');
const fetch = require('node-fetch');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const fakeData = require('./fakeData');

const FORECAST_DELAY = 0;

const API_KEY = process.env.DARKSKY_API_KEY;
const BASE_URL = process.env.DARKSKY_BASE_URL;

function generateFakeForecast(locationLatLon) {
  locationLatLon = locationLatLon || '40.7720232,-73.9732319';
  const commaIndex = location.indexOf(',');

  const result = Object.assign({}, fakeData.forecast());
  result.latitude = parseFloat(locationLatLon.substr(0, commaIndex));
  result.longitude = parseFloat(locationLatLon.substr(commaIndex + 1));
  return result;
}

function getForecast(req, res) {
  const locationLatLon = req.params.location || '40.7720232,-73.9732319';
  const url = `${BASE_URL}/${API_KEY}/${locationLatLon}`;
  
  fetch(url).then((res) => {
    return res.json();
  }).then((data) => {
    setTimeout(() => {
      res.json(data);
    }, FORECAST_DELAY);
  }).catch((error) => {
    console.error('Dark Sky API Error: ', error.message);
    res.json(generateFakeForcast(locationLatLon));
  });

}

function startServer() {
  const app = express();
  
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  app.use((req, res, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const message = `${now} - ${time} - ${path}`;
    console.log(message);
    next();
  });

  app.get('/forecasts/:location', getForecast);
  app.get('/forecast/', getForecast);
  app.get('/forecast', getForecast);

  app.use(express.static('public'));

  return app.listen('1738', () => {
    console.log('Hello-weather-pwa started on port 1738...');
  });
}

startServer();
