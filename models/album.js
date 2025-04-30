"use strict"
//tabla de album
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = Schema({
    title: String,
    description: String,
    year: number,
    image: String,
    artist: {type: Schema.ObjectId, ref:'Artist'}//se guarda el id de un pbjeto que esta guardado
});

module.exports = mongoose.model('Album',AlbumSchema)