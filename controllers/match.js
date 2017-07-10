'use strict'

const { MatchModel } = require('../models/match');
const { TeamModel } = require('../models/team');
const { addMatch } = require('./player');

function getMatchs(req, res) {
  MatchModel.find({})
    .populate({
      path: 'localTeam',
      populate: {
        path: 'players'
      }
    })
    .populate({
      path: 'awayTeam',
      populate: {
        path: 'players'
      }
    })
    .exec((err, matchs) => {
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
  const teamsReady = [];

  teamsReady[0] = saveTeam(body.localTeam);
  teamsReady[1] = saveTeam(body.awayTeam);

  Promise.all(teamsReady)
    .then(([localTeam, awayTeam]) => {
      if(!localTeam.players) localTeam.players = [];
      if(!awayTeam.players) awayTeam.players = [];
      const match = MatchModel({
        name: body.name,
        description: body.description,
        city: body.city,
        direction: body.direction,
        price: body.price,
        playersByTeam: body.playersByTeam,
        localTeam: localTeam._id,
        awayTeam: awayTeam._id
      });
      match.save((err, matchStored) => {
        if (err) res.status(500).send({
          error: {
            status: 500,
            message: err
          }
        })
        const request = [];
        localTeam.players.forEach((player, index) => {
          request[index] = addMatch(player, matchStored._id);
        });
        awayTeam.players.forEach((player, index) => {
          request[localTeam.players.length + index] = addMatch(player, matchStored._id);
        })
        Promise.all(request)
          .then(() => {
            res.status(200).send({ match: matchStored });
          })
      });
    })
}

function saveTeam(team) {
  return new Promise((resolve, reject) => {
    if (team._id) {
      resolve(team);
    } else {
      const newTeam = TeamModel({
        tmp: team.tmp === undefined ? true : team.tmp,
        name: team.name,
        players: team.players
      })

      newTeam.save((err, teamStored) => {
        if (err) reject(err);
        resolve(teamStored);
      })
    }
  })
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
