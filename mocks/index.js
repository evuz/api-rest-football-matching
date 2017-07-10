const fetch = require('node-fetch');

const { users } = require('./data/users');
const { players } = require('./data/players');
const { teams } = require('./data/teams');

const playersID = {};
const tokensID = {};
const teamsID = {};

function saveUser(user) {
  return makePOST('http://localhost:3001/api/signup', user)
}

function savePlayer(player, token) {
  return makePOST('http://localhost:3001/api/player', player, token)
}

function saveTeam(team) {
  const players = team.players.map(player => playersID[player]);
  return makePOST('http://localhost:3001/api/team',
    Object.assign({}, team, { players })
  )
}

function makePOST(url, data, token) {
  const myHeaders = {
    'Content-type': 'application/json'
  };
  if (token) {
    myHeaders['Authorization'] = 'Bearer ' + token;
  }
  return new Promise(resolve => {
    fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        resolve(res)
      })
  })
}

function init() {
  let request = [];
  users.forEach((user, index) => {
    request[index] = saveUser(user, index)
      .then(res => {
        console.log(`User ${res.displayName} registered.`)
        console.log(`Token: ${res.token}`);
        tokensID[res.displayName] = res.token;
        return savePlayer(players[index], res.token);
      })
      .then((res) => {
        const { player } = res;
        console.log(`Player ${player.name} registered.`)
        console.log(`PlayerID: ${player._id}`);
        playersID[player.name] = player._id;
      })
  });

  Promise.all(request)
    .then(() => {
      request = [];
      teams.forEach((team, index) => {
        request[index] = saveTeam(team)
          .then(res => {
            const { team } = res;
            console.log(`Team ${team.name} registered.`)
            console.log(`PlayerID: ${team._id}`);
            teamsID[team.name] = team._id;
          })
      })
    });
}

init();
