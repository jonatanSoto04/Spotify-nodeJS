'use strict'

const express = require('express');
const AlbumController = require('../controllers/album');
const md_auth = require('../middlewares/authenticated');

const multer = require('multer');//se Cambia multiparty por multer ya que multiparty tiene vulnerabilidades
const upload = multer({ dest: './uploads/albums' }); // Configure multer

const api = express.Router();

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, upload.single('image')], AlbumController.uploadImage); // Use multer middleware
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;