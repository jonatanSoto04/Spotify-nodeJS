'use strict'
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');//enncriptar contraseñas
const User = require('../models/user');
const jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        mensaje: "Probando una accion del controlador de usuarios del ApiRest con node y Mongo"
    });
}
//registro de un usuario
async function saveUser(req, res) {

    const user = new User();
    const params = req.body;

    user.name = params.name;
    user.lastName = params.lastName;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        //encriptar contrseña y guardar datos
        try {
            const hash = await bcrypt.hash(params.password, 10); // 10 es el número de rondas de salida
            user.password = hash;

            if (user.name != null && user.lastName != null && user.email != null) {
                const userStored = await user.save();
                if (!userStored) {
                    return res.status(404).send({ message: 'No se ha registrado el usuario' });
                }
                return res.status(200).send({ user: userStored });
            } else {
                res.status(200).send({ message: 'digeleciar todos los campos' });
            }
        } catch (err) {
            return res.status(500).send({ message: 'Error al guardar el usuario', error: err });
        }
    }

}
//login de un usuario registrado
async function loginUser(req, res) {
    const params = req.body;

    const email = params.email;
    const password = params.password;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).send({ message: 'El usuario no existe' });
        }

        const check = await bcrypt.compare(password, user.password);

        if (check) {
            if (params.gethash) {
                // devolver token en jwt
                res.status(200).send({
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({ user });
            }
        } else {
            return res.status(404).send({ message: 'El usuario no ha podido loguearse' });
        }
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}

//actuaalizar los datos del usuario
function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    if(userId != req.user.sub){
            return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }

    User.findByIdAndUpdate(userId, update, { new: true })// devuelve el objeto que se modifica
        .then(userUpdated => {
            if (!userUpdated) {
                return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            }
            return res.status(200).send({ user: userUpdated });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error al actualizar el usuario' });
        });
}

//cargar imagne del usuario
async function uploadImage(req, res) {
    const userId = req.params.id;

    if (req.file) { // Verificar si se cargó un archivo
        const file_path = req.file.path;
        const file_name = path.basename(file_path);
        const file_ext = path.extname(file_name).toLowerCase(); // Utilice req.file.mimetype para el tipo MIME
        const file_mime = req.file.mimetype;

        if (file_ext === '.png' || file_ext === '.jpg' || file_ext === '.gif') {
             if (file_mime === 'image/png' || file_mime === 'image/jpeg' || file_mime === 'image/gif') {
                User.findByIdAndUpdate(userId, { image: file_name }, { new: true })
            .then(userUpdated => {
                if (!userUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                }
                return res.status(200).send({image: file_name, user: userUpdated });
            })
            .catch(err => {
                        // Si hay un error al actualizar el usuario, elimine el archivo cargado
                        fs.unlink(file_path, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error removing uploaded file:', unlinkErr);
                            }
                            return res.status(500).send({ message: 'Error al actualizar el usuario', error: err });
                        });
            });
             } else {
                //Eliminar el archivo cargado si el tipo MIME no es válido
                fs.unlink(file_path, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error removing uploaded file:', unlinkErr);
                    }
                    res.status(400).send({ message: 'Tipo de archivo no válido. Se requiere una imagen (png, jpg o gif).' });
                });
             }
        } else {
            //Eliminar el archivo cargado si la extensión no es válida
            fs.unlink(file_path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error removing uploaded file:', unlinkErr);
                }
                res.status(400).send({ message: 'Extensión de archivo no válida. Se requiere una imagen (png, jpg o gif).' });
            });
        }

    }else{
        return res.status(400).send({ message: 'No has cargado ninguna imagen' });
    }
}

//buscar imagen 
async function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const path_file = path.join(__dirname, '../uploads/users/', imageFile); // Utilice path.join para compatibilidad entre plataformas

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
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};