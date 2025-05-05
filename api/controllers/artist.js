'use strict'
const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');
//importo modelos
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getArtist(req, res) {
  const artistId = req.params.id;

  Artist.findById(artistId)
    .then(artist => {
      if (!artist) {
        return res.status(404).send({ message: 'El artista no existe' });
      }
      res.status(200).send({ artist });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error en la petición', error: err });
    });
}
//guardar artista
function saveArtist(req, res) {

  const artist = new Artist();
  const params = req.body;

  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save()
    .then(artistStore => {
      if (!artistStore) {
        res.status(404).send({ menssage: 'El artista no ha sido guardado' });
      }
      res.status(200).send({ artist: artistStore });
    })
    .catch(err => {
      res.status(500).send({ menssage: 'Error al guardar el artista' });
    });
}
//obtener lista de artistas
async function getArtists(req, res) {
  const page = req.params.page || 1;  // Si no viene page para entnoces que use 1
  const itemsPerPage = 3;
  try {
    const artists = await Artist.find().sort('name').skip((page - 1) * itemsPerPage).limit(itemsPerPage);
    const total = await Artist.countDocuments(); // dar ka suma total de documentos
    if (!artists || artists.length === 0) {
      return res.status(404).send({ message: 'No hay artistas !!' });
    }
    return res.status(200).send({
      total_items: Math.ceil(total / itemsPerPage), // Calcula el total de paginas
      artists: artists
    });
  } catch (err) {
    return res.status(500).send({ message: 'Error en la petición' });
  }
}
//Actualizar Artista
function updateArtist(req, res) {
  const artistId = req.params.id;
  const update = req.body;

  Artist.findByIdAndUpdate(artistId, update, { new: true })
    .then(artistUpdated => {
      if (!artistUpdated) {
        return res.status(404).send({ message: 'Artista no actualizado' });
      }
      return res.status(200).send({ artist: artistUpdated });
    })
    .catch(err => {
      return res.status(500).send({ message: 'Error al guardar el artista' });
    });
}
// eliminar artista
function deleteArtist(req, res) {
  const artistId = req.params.id;

  Artist.findByIdAndDelete(artistId)
    .then(artistRemoved => {
      if (!artistRemoved) {
        res.status(404).send({ message: 'El artista no ha sido eliminado' });
      }
      Album.find({ artist: artistRemoved._id }).deleteMany()
        .then(albumRemoved => {
          if (!albumRemoved) {
            res.status(404).send({ message: 'El album no ha sido eliminado' });
          }
            Song.find({ album: albumRemoved._id }).deleteMany()
            .then(songRemoved => {
              if (!songRemoved) {
                res.status(404).send({ message: 'La cancion no ha sido eliminada' });
              }
              res.status(200).send({artist: artistRemoved});
            })
            .catch(err => {
              res.status(500).send({ message: 'Error al eliminar el cancion', error: err });
            });
        })
        .catch(err => {
          res.status(500).send({ message: 'Error al eliminar el album', error: err });
        });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error al eliminar el artista', error: err });
    });
}

//cargar imagne del usuario
function uploadImage(req, res){
    const artistId = req.params.id;
    const file_name = 'No se cargo la imagen';
    
    if(req.files){
        const file_path = req.files.image.path;
        const file_split = file_path.split('\\');
        const file_name = file_split[2];
        const ext_split = file_name.split('\.');
        const file_ext = ext_split[1];

        if(file_ext == 'png' ||  file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name})
            .then(artistUpdated => {
                if (!artistUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el artista' });
                }
                return res.status(200).send({ artist: artistUpdated });
            })
            .catch(err => {
                return res.status(500).send({ message: 'Error al actualizar el artista' });
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
    const path_file = './uploads/artists/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
}