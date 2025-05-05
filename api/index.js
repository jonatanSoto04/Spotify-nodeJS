'use strict'
//se carga las librerias
const mongoose= require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;//
//conexion a bd
mongoose.connect('mongodb://localhost:27017/spotify_node')
  .then(() => {
    console.log('Conexión exitosa');
    app.listen(port, function(){
        console.log("Servidor del ApiREST de musica escuchando en http://localhost:" + port);
    });
  })    
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });


