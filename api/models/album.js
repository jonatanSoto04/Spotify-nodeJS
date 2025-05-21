"use strict"
//tabla de album
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' }//se guarda el id de un pbjeto que esta guardado
});

AlbumSchema.pre('remove', async function (next) {
    try {
        // Eliminar todas las canciones asociadas al álbum
        await this.model('Song').deleteMany({ album: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Album', AlbumSchema)