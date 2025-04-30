'use strict'
const bcrypt = require('bcrypt-nodejs');//enncriptar contraseñas
const User = require('../models/user');
const jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        mensaje: "Probando una accion del controlador de usuarios del ApiRest con node y Mongo"
    });
}
//registro de un usuario
function saveUser(req, res) {

    const user = new User();
    const params = req.body;

    user.name = params.name;
    user.lastname = params.lastname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        //encriptar contrseña y guardar datos
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.lastname != null && user.email != null) {
                //guardar usuario
                user.save()
                    .then(userStored => {
                        if (!userStored) {
                            return res.status(404).send({ message: 'No se ha registrado el usuario' });
                        }
                        return res.status(200).send({ user: userStored });
                    })
                    .catch(err => {
                        return res.status(500).send({ message: 'Error al guardar el usuario' });
                    });
            } else {
                res.status(200).send({ message: 'digeleciar todos los campos' });
            }
        });
    } else {
        res.status(500).send({ message: 'Introduce la contraseña' });
    }

}
//login de un usuario registrado
function loginUser(req, res) {
    const params = req.body;

    const email = params.email;
    const password = params.password;

    User.findOne({ email: email.toLowerCase() })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'El usuario no existe' });
            }

            bcrypt.compare(password, user.password, (err, check) => {
                if (err) {
                    return res.status(500).send({ message: 'Error al comparar contraseñas' });
                }

                if (check) {
                    if (params.gethash) {
                        // devolver token en jwt
                        res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        return res.status(200).send({ user });
                    }
                } else {
                    return res.status(404).send({ message: 'El usuario no ha podido loguearse' });
                }
            });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error en la petición', error: err });
        });
}

//actuaalizar los datos del usuario
function updateUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    User.findByIdAndUpdate(userId, update, { new: true })
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


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser
};