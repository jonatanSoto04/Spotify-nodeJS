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

    // Validación de entrada
    if (!params.name || !params.album) {
        return res.status(400).send({ message: 'Faltan campos obligatorios: nombre y album son requeridos.' });
    }

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save()
        .then(songStore => {
            if (!songStore) {
                // si el guardado no es exitoso
                return res.status(404).send({ message: 'No se pudo guardar la cancion.' });
            }
            res.status(200).send({ song: songStore });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error al guardar la cancion.', error: err.message }); // Sending error message instead of object
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
            if (!songs) {
                res.status(404).send({ message: 'No se pudo obtener las canciones del album' });
            }
            res.status(200).send({ songs })
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la peticionde obtener canciones' }, err)
        });
}

//Actualizar cancion
function updateSong(req, res) {
    const songId = req.params.id;
    const update = req.body;

    // valida si se proporcionan parámetros de actualización
    if (Object.keys(update).length === 0) {
        return res.status(400).send({ message: 'No se proporcionaron parametros para actualizar.' });
    }

    Song.findByIdAndUpdate(songId, update, { new: true })
        .then(songUpdated => {
            if (!songUpdated) {
                return res.status(404).send({ message: 'No se pudo actualizar la cancion: cancion no encontrada.' });
            }
            res.status(200).send({ song: songUpdated });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la peticion de actualizar cancion.', error: err.message }); // Sending error message
        });
}

function deleteSong(req, res) {
    const songId = req.params.id;
    Song.findByIdAndDelete(songId)
        .then(songRemoved => {
            if (!songRemoved) {
                res.status(404).send({ message: 'Error al eliminar cancion' });
            }
            res.status(200).send({ song: songRemoved });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la peticion de eliminar cancion' });
        })
}

//cargar archivo sw cancion 
async function uploadfile(req, res) {
    const songId = req.params.id;

    if (req.file) {
        const file_path = req.file.path;
        const file_name = path.basename(file_path);
        const file_ext = path.extname(file_name).toLowerCase();
        const file_mime = req.file.mimetype;

        if (file_ext === '.mp3' || file_ext === '.ogg') {
            if (file_mime === 'audio/mpeg' || file_mime === 'audio/ogg') {
                try {
                    const songUpdated = await Song.findByIdAndUpdate(songId, { file: file_name }, { new: true });
                    if (!songUpdated) {
                         // Si hay un error al actualizar la canción, elimine el archivo cargado
                        fs.unlink(file_path, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error al eliminar el archivo cargado:', unlinkErr);
                            }
                        });
                        return res.status(404).send({ message: 'No se ha podido actualizar la cancion' });
                    }
                    return res.status(200).send({ song: songUpdated });
                } catch (err) {
                     // Si hay un error al actualizar la canción, elimine el archivo cargado
                     fs.unlink(file_path, (unlinkErr) => {
                         if (unlinkErr) {
                             console.error('Error al eliminar el archivo cargado:', unlinkErr);
                         }
                         return res.status(500).send({ message: 'Error al actualizar la cancion', error: err });
                     });
                }
            } else {
                //Eliminar el archivo cargado si el tipo MIME no es válido
                fs.unlink(file_path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error removing uploaded file:', unlinkErr);
                    }
                    res.status(400).send({ message: 'Tipo de archivo no válido. Se requiere un archivo de audio (mp3 u ogg).!' });
                });
            }
        } else {
            //Eliminar el archivo cargado si la extensión no es válida
            fs.unlink(file_path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error al eliminar el archivo cargado:', unlinkErr);
                }
                res.status(400).send({ message: 'Extensión de archivo no válida. Se requiere un archivo de audio (mp3 u ogg).' });
            });
        }
    } else {
        return res.status(200).send({ message: 'No has cagado ninguna cancion' });
    }
}

//Obtener imagen 
async function getSongFile(req, res) {
    const songFile = req.params.songFile;
    const path_file = path.join(__dirname, '../uploads/songs/', songFile);// Utilice path.join para compatibilidad entre plataformas

    try {
        await fs.promises.access(path_file, fs.constants.F_OK); //Comprueba si el archivo existe
        res.sendFile(path.resolve(path_file));
    } catch (err) {
        // Si el archivo no existe, devuelve un 404
        if (err.code === 'ENOENT') {
            res.status(404).send({ message: 'No existe la cancion...' });
        } else {
            res.status(500).send({ message: 'Error al obtener la cancion', error: err });
        }
    }
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