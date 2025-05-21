'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');

const api = express.Router();

const multer = require('multer'); //se Cambia multiparty por multer ya que multiparty tiene vulnerabilidades
const upload = multer({ dest: './uploads/users' }); // Configure multer

api.get('/probando-controlador',md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;