'use strict'

const User = require('../models/user');
const tokenSrv = require('../services/token');

function signUp(req, res) {
  const { email, password, displayName } = req.body;
  const user = new User({
    email,
    displayName,
    password
  });
  user.avatar = user.gravatar();
  user.save((err) => {
    if (err) return res.status(500).send({
      message: 'Error al crear el usuario',
      error: err
    })

    return res.status(200).send({
      displayName,
      email,
      avatar: user.avatar,
      token: tokenSrv.createToken(user)
    })
  });
}

function signIn(req, res) {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .populate('playerId')
    .exec((err, user) => {
      if (err) return res.status(500).send({ error: err })
      if (!user) return res.status(404).send({
        error: {
          code: 404,
          message: 'User not found'
        }
      });
      if (!user.validPassword(password)) return res.status(401).send({
        error: {
          code: 401,
          message: 'Invalid password'
        }
      })
      updateUser({
        userId: user._id,
        lastLogin: Date.now()
      })
      res.status(200).send({
        message: 'Succes',
        user: {
          displayName: user.displayName,
          email: user.email,
          avatar: user.avatar,
          playerId: user.playerId,
          token: tokenSrv.createToken(user)
        }
      })
    })
}

function validateToken(req, res) {
  const { user } = req;
  User
    .findById(user)
    .populate('playerId')
    .exec((err, user) => {
      updateUser({
        userId: user._id,
        lastLogin: Date.now()
      })
      res.status(200).send({
        message: 'Succes',
        user: {
          displayName: user.displayName,
          email: user.email,
          avatar: user.avatar,
          playerId: user.playerId
        }
      });
    })
}

function updateUser(data) {
  return new Promise((resolve, reject) => {
    User.findById(data.userId, (err, user) => {
      if (err) reject({
        error: {
          status: 500,
          message: err
        }
      });
      Object.keys(data).forEach(key => {
        if (key == 'userId') return;
        user[key] = data[key];
      })
      user.save((err, userUpdated) => {
        if (err) reject({
          error: {
            status: 500,
            message: err
          }
        });
        resolve({ userUpdated })
      })
    })
  })
}

module.exports = {
  signIn,
  signUp,
  validateToken,
  updateUser
};
