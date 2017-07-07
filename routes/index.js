'use strict'

const express = require('express');
const api = express.Router();

const FieldCtrl = require('../controllers/field')
const UserCtrl = require('../controllers/user');
const MatchCtrl = require('../controllers/match');
const PlayerCtrl = require('../controllers/player');

const { isAuth } = require('../middlewares/auth');

// Fields Routes
api.get('/field', FieldCtrl.getFields);
api.get('/field/:fieldId', FieldCtrl.getField);
api.post('/field', FieldCtrl.saveField);
api.put('/field/:fieldId', FieldCtrl.updateField);
api.delete('/field/:fieldId', FieldCtrl.deleteField);

// Match Routes
api.get('/match', MatchCtrl.getMatchs);
api.get('/match/:matchId', MatchCtrl.getMatch);
api.post('/match', MatchCtrl.saveMatch);
api.put('/match/:matchId', MatchCtrl.updateMatch);
api.delete('/match/:matchId', MatchCtrl.deleteMatch);

// Player Routes
api.get('/player', PlayerCtrl.getPlayers);
api.get('/player/:playerId', PlayerCtrl.getPlayer);
api.post('/player', isAuth, PlayerCtrl.savePlayer);
api.post('/externalPlayer', PlayerCtrl.savePlayer);
api.put('/player/:playerId', PlayerCtrl.updatePlayer);
api.delete('/player/:playerId', PlayerCtrl.deletePlayer);

// Routes for manage users
api.post('/signup', UserCtrl.signUp);
api.post('/signin', UserCtrl.signIn);
api.get('/signin', isAuth, UserCtrl.validateToken);
api.get('/private', isAuth, function (req, res) {
  res.status(200).send({ message: 'Tienes acceso' });
});

module.exports = api;
