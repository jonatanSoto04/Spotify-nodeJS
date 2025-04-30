//configuracion de express
'use strict'
// se cargan las librerias
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//configuracion de body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configuracion de cabeceras http

// Rutas Base y con

module.exports = app;