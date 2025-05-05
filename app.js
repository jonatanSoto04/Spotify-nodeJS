//configuracion de express
'use strict'
// se cargan las librerias
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//cargar rutas
const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');
const song_routes = require('./routes/song');

//configuracion de body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// configuracion de cabeceras http

// Rutas Base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;