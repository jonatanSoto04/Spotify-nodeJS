'use strict'
const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');
//importo modelos
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const album = require('../models/album');

function getAlbum(req, res) {
    const albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artist' }).exec()//path es la propieddad donde se van a cargar los datos asociados a artist
        .then(album => {
            if (!album) {
                res.status(404).send({ message: 'No fue posible encontrar el album' })
            }
            res.status(200).send({ album })
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la peticion' });
        });
}
//Guardar album
function saveAlbum(req, res) {
    const album = new Album();

    const params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save()
        .then(albumStore => {
            if (!albumStore) {
                res.status(404).send({ message: 'El album no se ha guardado' });
            }
            res.status(200).send({ album: albumStore });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error al guardar album' });
        });
}

function getAlbums(req, res) {
    const artistId = req.params.artist;
    var find;
    if (!artistId) {
        //sacar todos los albums de la base de datos
        find = Album.find({}).sort('title');
    } else {
        // sacar todos los albums que pentence al artista espeificado
        find = Album.find({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec()
        .then(albums => {
            if (!albums) {
                res.status(404).send({ message: 'No fue posible encontrar los albums' });
            }
            res.status(200).send({ albums });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la peticion' });
        });
}

function updateAlbum(req, res) {
    const albumId = req.params.id;
    const update = req.body;

    Album.findByIdAndUpdate(albumId, update, { new: true })
        .then(albumUpdated => {
            if (!albumUpdated) {
                return res.status(404).send({ message: 'No se encontro el album' });
            }
            res.status(200).send({ album: albumUpdated });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error en la consulta' });
        });
}

function deleteAlbum(req, res) {
    const albumId = req.params.id;

    Album.findByIdAndDelete(albumId).deleteMany()
        .then(albumRemoved => {
            if (!albumRemoved) {
                res.status(404).send({ message: 'El album no ha sido eliminado' });
            }
            Song.find({ album: albumRemoved._id }).deleteMany()
                .then(songRemoved => {
                    if (!songRemoved) {
                        res.status(404).send({ message: 'La cancion no ha sido eliminada' });
                    }
                    res.status(200).send({ album: albumRemoved });
                })
                .catch(err => {
                    res.status(500).send({ message: 'Error al eliminar el cancion', error: err });
                });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error al eliminar el album', error: err });
        });
}

//cargar imagne del usuario
function uploadImage(req, res){
    const albumId = req.params.id;
    const file_name = 'No se cargo la imagen';
    
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' ||  file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name})
            .then(albumUpdated => {
                if (!albumUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el album' });
                }
                return res.status(200).send({ album: albumUpdated });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al actualizar el album' });
            });
        }else{
            res.status(200).send({message: 'Se requiere que la imagen sea tipo "png""jpg" o "gif"'});
        }
    }else{
        return res.status(200).send({ message: 'No has cagado ninguna imagen' });
    }
}

//Obtener imagen 
function getImageFile(req, res){
    const imageFile = req.params.imageFile;
    const path_file = './uploads/album/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};