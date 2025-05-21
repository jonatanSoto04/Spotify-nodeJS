'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
const md_auth = require('../middlewares/authenticated');

const multer = require('multer'); // //se Cambia multiparty por multer ya que multiparty tiene vulnerabilidades
const upload = multer({ dest: './uploads/artists' }); // Configure multer

const api = express.Router();

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, upload.single('image')], ArtistController.uploadImage); // Use multer middleware
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;