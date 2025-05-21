'use strict'

const express = require('express');
const SongController = require('../controllers/song');
const md_auth = require('../middlewares/authenticated');

const multer = require('multer'); //se Cambia multiparty por multer ya que multiparty tiene vulnerabilidades
const upload = multer({ dest: './uploads/songs' }); // Configure multer

const api = express.Router();

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, upload.single('file')], SongController.uploadfile); // Use multer middleware with field name 'file'
api.get('/get-song-file/:songFile', SongController.getSongFile);

module.exports = api;