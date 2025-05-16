'use strict'
const path = require('path');
const fs = require('fs');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

//Obtener cancion
function getSong(req, res) {
    const songId = req.params.id;

    Song.findById(songId).populate({ path: 'album' }).exec()
        .then(song => {
            if (!song) {
                res.status(404).send({ message: 'Error al obtener cancion' });
            }
            res.status(200).send({ song: song });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la peticion de obtener cancion' });
        })
}
//guardar cancion
function saveSong(req, res) {
    const song = new Song();

    const params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save()
        .then(songStore => {
            if (!songStore) {
                res.status(404).send({ message: 'error al guardar imagen' });
            }
            res.status(200).send({ song: songStore });
        })
        .catch(err => {
            res.status().send({ message: 'Error en la peticion' }, err);
        });
}

//Obtener lista de canciones
function getSongs(req, res) {
    const albumId = req.params.album;
    var find;
    if (!albumId) {
        find = Song.find({}).sort('number');
    } else {
        find = Song.find({ album: albumId }).sort('number');
    }
    //en vez de obtener el id del album me trae todo el objeto del album, mismo caso con el id de artista
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            module: 'Artist'
        }
    }).exec()
    .then(songs => {
        if(!songs){
            res.status(404).send({message: 'No se pudo obtener las canciones del album'});
        }
        res.status(200).send({songs})
    })
    .catch(err => {
        res.status(500).send({message: 'Error en la peticionde obtener canciones'}, err)
    });
}

//Actualizar cancion
function updateSong(req, res){
    const songId = req.params.id;
    const update = req.body;
    
    Song.findByIdAndUpdate(songId, update, {new: true})
    .then(songUpdated => {
        if(!songUpdated){
            res.status(404).send({message: 'No se pudo actualizar la cancion'});
        }
        res.status(200).send({song: songUpdated});
    })
    .catch(err => {
        res.status(500).send({message: 'Error en la peticion de actualizar cancion'});
    });
}

function deleteSong(req, res){
    const songId = req.params.id;
    Song.findByIdAndDelete(songId)
    .then(songRemoved => {
        if(!songRemoved){
            res.status(404).send({message: 'Error al eliminar cancion'});
        }
        res.status(200).send({song: songRemoved});
    })
    .catch(err => {
        res.status(500).send({message: 'Error en la peticion de eliminar cancion'});
    })
}

//cargar archivo sw cancion 
function uploadfile(req, res){
    const songId = req.params.id;
    const file_name = 'No se cargo la imagen';
    
    if(req.files && req.files.file){
        const file_path = req.files.file.path;
        const file_split = file_path.split(/[\/\\]/);
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name})
            .then(songUpdated => {
                if (!songUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el album' });
                }
                return res.status(200).send({ song: songUpdated });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error error en la peticion de cargar cancion', err });
            });
        }else{
            res.status(200).send({message: 'Se requiere que la archivo sea tipo "mp3"'});
        }
    }else{
        return res.status(200).send({ message: 'No has cagado ninguna cancion' });
    }
}

//Obtener imagen 
function getSongFile(req, res){
    const imageFile = req.params.songFile;
    const path_file = './uploads/songs/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la cancion...'});
        }
    });
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadfile,
    getSongFile
};