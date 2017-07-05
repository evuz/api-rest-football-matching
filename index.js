'use strict'

const mongoose = require('mongoose');
const app = require('./app');

const config = require('./config');

mongoose.connect(config.db, (err) => {
  if (err) {
    // eslint-disable-next-line
    return console.error(`Error al conectar con la base de datos: ${err}`);
  }
  // eslint-disable-next-line
  console.log('Conexión a la base de datos realizada');

  app.listen(config.port, () => {
    // eslint-disable-next-line
    console.log(`Servidor iniciado en http://localhost:${config.port}`);
  })
});
