'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta';

//permite comprobar si el token es correcto
exports.ensureAuth = function(req, res, next){ 
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la peticion no tinen la cabecera de autenticacion'})
    }
    const token = req.headers.authorization.replace(/['"]+/g, ''); //remplazar las comillas simples y dobles que pueda traer el string del token por nada
    try {
        const payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token ha expirado'})
        }
        req.user = payload;
        next();
    } catch (ex) {
        console.log(ex);
        return res.status(404).send({message: 'Token no valido'})
    }

};