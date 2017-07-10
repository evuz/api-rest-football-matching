'use strict'

const { PlayerModel } = require('../models/player');
const { updateUser } = require('../controllers/user');

function getPlayer(req, res) {
  let playerId = req.params.playerId;

  PlayerModel
    .findById(playerId)
    .select('-userId')
    .exec((err, player) => {
      if (err) return res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      if (!player) return res.status(404).send({
        error: {
          status: 404,
          message: 'Player don\'t found'
        }
      });

      res.status(200).send({ player });
    });
}

function getPlayers(req, res) {
  PlayerModel
    .find({})
    .select('-userId')
    .exec((err, player) => {
      if (err) return res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      if (!player) return res.status(404).send({
        error: {
          status: 404,
          message: 'Player don\'t found'
        }
      });

      res.status(200).send({ player });
    });
}

function savePlayer(req, res) {
  const { body, user } = req;
  let player = PlayerModel({
    userId: user,
    name: body.name,
    description: body.description,
    image: body.image,
    city: body.city,
    favoritePosition: body.favoritePosition,
    birthdate: body.birthdate,
    stars: body.stars
  });

  player.save((err, playerStored) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    if (user) {
      updateUser({
        userId: user,
        playerId: playerStored._id
      }).then(({ userUpdated }) => {
        res.status(200).send({
          user: userUpdated,
          player: playerStored
        });
      })
    } else {
      res.status(200).send({ player: playerStored });
    }
  });
}

function addMatch(playerId, matchId) {
  return new Promise((resolve, reject) => {
    PlayerModel.findById(playerId, (err, player) => {
      if (err) reject({
        error: {
          status: 500,
          message: err
        }
      });
      if (!player.matchsPlayed) player.matchsPlayed = [];
      player.matchsPlayed.push(matchId);
      player.save((err, playerStored) => {
        if (err) reject({
          error: {
            status: 500,
            message: err
          }
        });
        resolve({
          player: playerStored
        })
      })
    })
  })
}

function removeMatch(playerId, matchId) {
  return new Promise((resolve, reject) => {
    PlayerModel.findById(playerId, (err, player) => {
      if (err) reject({
        error: {
          status: 500,
          message: err
        }
      });
      if (!player.matchsPlayed) player.matchsPlayed = [];
      const key = player.matchsPlayed.findIndex(match => match === matchId);
      if (key > -1) {
        player.matchsPlayed.splice(key, 1);
        player.save((err, playerStored) => {
          if (err) reject({
            error: {
              status: 500,
              message: err
            }
          });
          resolve({
            player: playerStored
          })
        })
      }
    })
  })
}

function updatePlayer(req, res) {
  let playerId = req.params.playerId;
  let updateProps = req.body;

  PlayerModel.findById(playerId, (err, player) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    Object.keys(updateProps).forEach(key => {
      player[key] = updateProps[key];
    })
    player.save((err, playerUpdated) => {
      if (err) res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      res.status(200).send({ player: playerUpdated });
    })
  })
}

function deletePlayer(req, res) {
  let playerId = req.params.playerId;

  PlayerModel.findById(playerId, (err, player) => {
    if (err) res.status(500).send({
      message: `Error al obtener el elemento de la base de datos ${err}`
    });
    player.remove(err => {
      if (err) res.status(500).send({
        message: `Error al borrar el elemento de la base de datos ${err}`
      });
      res.status(200).send({ message: 'Elemento eliminado' });
    })
  });
}

module.exports = {
  getPlayer,
  getPlayers,
  savePlayer,
  updatePlayer,
  addMatch,
  removeMatch,
  deletePlayer
}
