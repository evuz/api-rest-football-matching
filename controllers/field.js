'use strict'

const Field = require('../models/field');

function getField(req, res) {
  let fieldId = req.params.fieldId;

  Field.findById(fieldId, (err, field) => {
    if (err) return res.status(500).send({
      message: `Error al realizar la petición ${err}`
    });
    if (!field) return res.status(404).send({ message: 'El campo no existe' });

    res.status(200).send({ field });
  });
}

function getFields(req, res) {
  Field.find({}, (err, field) => {
    if (err) return res.status(500).send({
      message: `Error al realizar la petición ${err}`
    });
    if (!field) return res.status(404).send({ message: 'El campo no existe' });

    res.status(200).send({ field });
  });
}

function saveField(req, res) {
  let field = Field();
  field.name = req.body.name;
  field.description = req.body.description;
  field.image = req.body.image;
  field.city = req.body.city;
  field.category = req.body.category;
  field.stars = req.body.stars;

  field.save((err, fieldStored) => {
    if (err) res.status(500).send({
      message: `Error al guardar en la base de datos ${err}`
    })
    res.status(200).send({ field: fieldStored });
  });
}

function updateField(req, res) {
  let fieldId = req.params.fieldId;
  let update = req.body;

  Field.findByIdAndUpdate(fieldId, update, (err, fieldUpdate) => {
    if (err) res.status(500).send({
      message: `Error al actualizar el elemento de la base de datos ${err}`
    });
    res.status(200).send({ field: fieldUpdate });
  })
}

function deleteField(req, res) {
  let fieldId = req.params.fieldId;

  Field.findById(fieldId, (err, field) => {
    if (err) res.status(500).send({
      message: `Error al obtener el elemento de la base de datos ${err}`
    });
    field.remove(err => {
      if (err) res.status(500).send({
        message: `Error al borrar el elemento de la base de datos ${err}`
      });
      res.status(200).send({ message: 'Elemento eliminado' });
    })
  });
}

module.exports = {
  getField,
  getFields,
  saveField,
  updateField,
  deleteField
}
