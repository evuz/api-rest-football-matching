'use strict'

const { MatchModel } = require('../models/match');

function getMatchs(req, res) {
  MatchModel.find({}, (err, matchs) => {
    if (err) return res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    if (!matchs) return res.status(404).send({
      error: {
        status: 404,
        message: 'Matchs don\'t found'
      }
    });

    res.status(200).send({ matchs });
  });
}

function getMatch(req, res) {
  let matchId = req.params.matchId;

  MatchModel.findById(matchId, (err, match) => {
    if (err) return res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    if (!match) return res.status(404).send({
      error: {
        status: 404,
        message: 'Match don\'t found'
      }
    });

    res.status(200).send({ match });
  });
}

function saveMatch(req, res) {
  const { body } = req;
  let match = MatchModel({
    name: body.name,
    description: body.description,
    city: body.city,
    direction: body.direction,
    price: body.price,
    playersByTeam: body.playersByTeam,
    localTeam: body.localTeam,
    awayTeam: body.awayTeam
  });

  match.save((err, matchStored) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    })
    res.status(200).send({ match: matchStored });
  });
}

function updateMatch(req, res) {
  let matchId = req.params.matchId;
  let updateProps = req.body;

  MatchModel.findById(matchId, (err, match) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    Object.keys(updateProps).forEach(key => {
      match[key] = updateProps[key];
    })
    match.save((err, matchUpdated) => {
      if (err) res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      res.status(200).send({ match: matchUpdated });
    })
  })
}

function deleteMatch(req, res) {
  let matchId = req.params.matchId;

  MatchModel.findById(matchId, (err, match) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    match.remove(err => {
      if (err) res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      res.status(200).send({
        message: 'Match removed'
      });
    })
  });
}

module.exports = {
  getMatch,
  getMatchs,
  saveMatch,
  updateMatch,
  deleteMatch
}
