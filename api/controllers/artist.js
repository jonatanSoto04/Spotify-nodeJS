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
  const itemsPerPage = 4;
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
async function deleteArtist(req, res) {
    const artistId = req.params.id;

    try {
        const artistRemoved = await Artist.findByIdAndDelete(artistId);

        if (!artistRemoved) {
            return res.status(404).send({ message: 'El artista no ha sido eliminado' });
        }

        // Encuentra todos los álbumes asociados al artista los elimínala.
        // El middleware del álbum eliminará las canciones asociadas.
        const albums = await Album.find({ artist: artistRemoved._id });
        for (const album of albums) {
            await album.remove(); // Esto activará el middleware pre('remove') en el modelo Álbum
        }

        res.status(200).send({ artist: artistRemoved });

    }catch (err) {
      res.status(500).send({ message: 'Error al eliminar el artista', error: err });
    };
}

//cargar imagne del usuario
async function uploadImage(req, res) {
  const artistId = req.params.id;

  if (req.file) { // Verificar si se cargó un archivo
    const file_path = req.file.path;
    const file_name = path.basename(file_path);
    const file_ext = path.extname(file_name).toLowerCase();
    const file_mime = req.file.mimetype; // Utilice req.file.mimetype para el tipo MIME

    if (file_ext === '.png' || file_ext === '.jpg' || file_ext === '.gif') {
      if (file_mime === 'image/png' || file_mime === 'image/jpeg' || file_mime === 'image/gif') {
        try {
          const artistUpdated = await Artist.findByIdAndUpdate(artistId, { image: file_name }, { new: true });
          if (!artistUpdated) {
            // Si hay un error al actualizar el artista, elimine el archivo cargado
            fs.unlink(file_path, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error removing uploaded file:', unlinkErr);
              }
            });
            return res.status(404).send({ message: 'No se ha podido actualizar el artista' });
          }
          return res.status(200).send({ artist: artistUpdated });
        } catch (err) {
          // Si hay un error al actualizar el artista, elimine el archivo cargado
          fs.unlink(file_path, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error removing uploaded file:', unlinkErr);
            }
            return res.status(500).send({ message: 'Error al actualizar el artista', error: err });
          });
        }
      } else {
        // Eliminar el archivo cargado si el tipo MIME no es válido
        fs.unlink(file_path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error removing uploaded file:', unlinkErr);
          }
          res.status(400).send({ message: 'Tipo de archivo no válido. Se requiere una imagen (png, jpg o gif).' });
        });
      }
    } else {
      // Eliminar el archivo cargado si la extensión no es válida
      fs.unlink(file_path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error removing uploaded file:', unlinkErr);
        }
        res.status(400).send({ message: 'Extensión de archivo no válida. Se requiere una imagen (png, jpg o gif).' });
      });
    }
  } else {
    return res.status(400).send({ message: 'No has cargado ninguna imagen' });
  }
}

//Obtener imagen 
function getImageFile(req, res) {
  async function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const path_file = path.join(__dirname, '../uploads/artists/', imageFile); // Utilice path.join para compatibilidad entre plataformas

    try {
      await fs.promises.access(path_file, fs.constants.F_OK);  //Comprueba si el archivo existe
      res.sendFile(path.resolve(path_file));
    } catch (err) {
      // If the file doesn't exist, return a 404
      if (err.code === 'ENOENT') {
        res.status(404).send({ message: 'No existe la imagen...' });
      } else { 
      // Manejar otros tipos errores
        res.status(500).send({ message: 'Error al obtener la imagen', error: err });
      }
    }
  }
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
