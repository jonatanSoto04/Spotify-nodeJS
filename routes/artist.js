'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
const md_auth = require('../middlewares/authenticated')

const api = express.Router();

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);

module.exports = api;