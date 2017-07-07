'use strict'

const { TeamModel } = require('../models/team');

function getTeams(req, res) {
  TeamModel
    .find({})
    .populate('players', '-userId')
    .exec((err, teams) => {
      if (err) return res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      if (!teams) return res.status(404).send({
        error: {
          status: 404,
          message: 'Teams don\'t found'
        }
      });

      res.status(200).send({ teams });
    });
}

function getTeam(req, res) {
  let teamId = req.params.teamId;

  TeamModel
    .findById(teamId)
    .populate('players', '-userId')
    .exec((err, team) => {
      if (err) return res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      if (!team) return res.status(404).send({
        error: {
          status: 404,
          message: 'Team don\'t found'
        }
      });

      res.status(200).send({ team });
    });
}

function saveTeam(req, res) {
  const { body } = req;
  let team = TeamModel({
    name: body.name,
    players: body.players
  });

  team.save((err, teamStored) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    })
    res.status(200).send({ team: teamStored });
  });
}

function updateTeam(req, res) {
  let teamId = req.params.teamId;
  let updateProps = req.body;

  TeamModel.findById(teamId, (err, team) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    Object.keys(updateProps).forEach(key => {
      team[key] = updateProps[key];
    })
    team.save((err, teamUpdated) => {
      if (err) res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      res.status(200).send({ team: teamUpdated });
    })
  })
}

function removePlayer(req, res) {
  let { teamId, playerId } = req.params;
  TeamModel.findById(teamId, (err, team) => {
    if (!team.players) team.players = [];
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });

    const key = team.players.findIndex((player) => player == playerId);
    if (key > -1) {
      team.players.splice(key, 1);
      team.save((err, teamUpdated) => {
        if (err) res.status(500).send({
          error: {
            status: 500,
            message: err
          }
        });
        res.status(200).send({ team: teamUpdated });
      })
    } else {
      res.status(404).send({
        error: {
          status: 404,
          message: 'User doesn\'t below to the team'
        }
      });
    }
  })
}

function addPlayer(req, res) {
  let { teamId, playerId } = req.params;

  TeamModel.findById(teamId, (err, team) => {
    if (!team.players) team.players = [];
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });

    team.players.push(playerId);
    team.save((err, teamUpdated) => {
      if (err) res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      res.status(200).send({ team: teamUpdated });
    })
  })
}

function deleteTeam(req, res) {
  let teamId = req.params.teamId;

  TeamModel.findById(teamId, (err, team) => {
    if (err) res.status(500).send({
      error: {
        status: 500,
        message: err
      }
    });
    team.remove(err => {
      if (err) res.status(500).send({
        error: {
          status: 500,
          message: err
        }
      });
      res.status(200).send({
        message: 'Team removed'
      });
    })
  });
}

module.exports = {
  getTeam,
  getTeams,
  saveTeam,
  updateTeam,
  addPlayer,
  removePlayer,
  deleteTeam
}
