'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');

const api = express.Router();

const multer = require('multer');
const upload = multer({ dest: './uploads/users' }); // multer config

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, upload.single('image')], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;