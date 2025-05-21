'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = process.env.JWT_SECRET; // Leer las variables de entorno

//permite comprobar si el token es correcto
exports.ensureAuth = function(req, res, next){ 
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'}); // Corrected message
    }
    const token = req.headers.authorization.replace(/['"]+/g, ''); 

    try {
        const payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'Token ha expirado'})
        }
        req.user = payload;
        next();
    } catch (ex) {
        //console.log(ex);
        return res.status(401).send({message: 'Token inválido'}); // Se cambió el código de estado a 401 y se corrigió el mensaje.
    }
};