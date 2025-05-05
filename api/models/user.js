"use strict"
//tabla de usuario
const mongoose = require('mongoose'); //acceder a la base de datos
const Schema = mongoose.Schema; //ayuda a definir un modelo de base de datos

const UserSchema = Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);