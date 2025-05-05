'use strict'
const jwt = require('jwt-simple'); //creacion del token
const moment = require('moment'); //tiempo de duracion de token
const secret = 'clave_secreta';

exports.createToken = function(user){
    const payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};

