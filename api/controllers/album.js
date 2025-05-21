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

async function deleteAlbum(req, res) {
    const albumId = req.params.id;

    try {
        const albumRemoved = await Album.findByIdAndDelete(albumId);

        if (!albumRemoved) {
            return res.status(404).send({ message: 'El album no ha sido eliminado' });
        }

        // Eliminar todas las canciones asociadas al álbum simultáneamente
        await Song.deleteMany({ album: albumRemoved._id });

        res.status(200).send({ album: albumRemoved });

    } catch (err) {
        res.status(500).send({ message: 'Error al eliminar el album', error: err });
    }
}

//cargar imagne del usuario
async function uploadImage(req, res) {
    const albumId = req.params.id;

    if (req.file) { // Verificar si se cargó un archivo
        const file_path = req.file.path;
        const file_name = path.basename(file_path);
        const file_ext = path.extname(file_name).toLowerCase();
        const file_mime = req.file.mimetype; // Utilice req.file.mimetype para el tipo MIME

        if (file_ext === '.png' || file_ext === '.jpg' || file_ext === '.gif') {
            if (file_mime === 'image/png' || file_mime === 'image/jpeg' || file_mime === 'image/gif') {
                try {
                    const albumUpdated = await Album.findByIdAndUpdate(albumId, { image: file_name }, { new: true });
                    if (!albumUpdated) {
                         // Si hay un error al actualizar el álbum, elimine el archivo cargado
                         fs.unlink(file_path, (unlinkErr) => {
                             if (unlinkErr) {
                                 console.error('Error removing uploaded file:', unlinkErr);
                             }
                         });
                        return res.status(404).send({ message: 'No se ha podido actualizar el album' });
                    }
                    return res.status(200).send({ album: albumUpdated });
                } catch (err) {
                    // Si hay un error al actualizar el álbum, elimine el archivo cargado
                     fs.unlink(file_path, (unlinkErr) => {
                         if (unlinkErr) {
                             console.error('Error removing uploaded file:', unlinkErr);
                         }
                         return res.status(500).send({ message: 'Error al actualizar el album', error: err });
                     });
                }
            } else {
                //Eliminar el archivo cargado si el tipo MIME no es válido
                fs.unlink(file_path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error removing uploaded file:', unlinkErr);
                    }
                    res.status(400).send({ message: 'Tipo de archivo no válido. Se requiere una imagen (png, jpg o gif).!' });
                });
            }
        } else {
            //Eliminar el archivo cargado si la extensión no es válido
            fs.unlink(file_path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error al eliminar el archivo cargado:', unlinkErr);
                }
                res.status(400).send({ message: 'Extensión de archivo no válida. Se requiere una imagen (png, jpg o gif).!' });
            });
        }
    } else {
        return res.status(400).send({ message: 'No has cargado ninguna imagen' });
    }
}

//Obtener imagen
async function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const path_file = path.join(__dirname, '../uploads/albums/', imageFile); // Utilice path.join para compatibilidad entre plataformas
    try {
        await fs.promises.access(path_file, fs.constants.F_OK); //Comprueba si el archivo existe
        res.sendFile(path.resolve(path_file));
    } catch (err) {
        // Si el archivo no existe, devuelve un 404
        if (err.code === 'ENOENT') {
            res.status(404).send({ message: 'No existe la imagen...' });
        } else {
            // Manejar otros errores potenciales
            res.status(500).send({ message: 'Error al obtener la imagen', error: err });
        }
    }
}

//Obtener imagen 
async function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const path_file = path.join(__dirname, '../uploads/albums/', imageFile); // Utilice path.join para compatibilidad entre plataformas
    try {
        await fs.promises.access(path_file, fs.constants.F_OK); //Comprueba si el archivo existe
        res.sendFile(path.resolve(path_file));
    } catch (err) {
        // Si el archivo no existe, devuelve un 404
        if (err.code === 'ENOENT') {
            res.status(404).send({ message: 'No existe la imagen...' });
        } else {
            // Manejar otros errores potenciales
            res.status(500).send({ message: 'Error al obtener la imagen', error: err });
        }
    }
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