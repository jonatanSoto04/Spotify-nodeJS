'use strict'
const path = require('path');
const fs = require('fs');
//importo modelos
const Artist = require('../models/artist');
const album = require('../models/album');
const song = require('../models/song');

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

function saveArtist(req, res){

    const artist = new Artist();
    const params = req.body;
    
    artist.name =  params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save()
        .then(artistStore => {
            if(!artistStore){
                res.status(404).send({menssage: 'El artista no ha sido guardado'});
            }
            res.status(200).send({artist: artistStore});        
        })
        .catch(err => {
            res.status(500).send({menssage: 'Error al guardar el artista'});
    });
}



module.exports = {
    getArtist,
    saveArtist
}