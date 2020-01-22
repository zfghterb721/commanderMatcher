var _ = require("lodash");
var podSize = 4;
var currentRound = 0;
var playerList = [
  {
    name: "Rebecca Lott",
    points: 3,
    id: 0
  },
  {
    name: "Bates Deleon",
    points: 2,
    id: 1
  },
  {
    name: "Cheri Craig",
    points: 2,
    id: 2
  },
  {
    name: "Rollins Sherman",
    points: 2,
    id: 3
  },
  {
    name: "Loraine Fuentes",
    points: 0,
    id: 4
  },
  {
    name: "Sondra Young",
    points: 3,
    id: 5
  },
  {
    name: "Chris Holland",
    points: 3,
    id: 6
  },
  {
    name: "Bentley Morrison",
    points: 0,
    id: 7
  },
  {
    name: "Harrington Poole",
    points: 1,
    id: 8
  },
  {
    name: "Osborn Joseph",
    points: 2,
    id: 9
  },
  {
    name: "Sallie Carney",
    points: 0,
    id: 10
  },
  {
    name: "Jo Sweeney",
    points: 0,
    id: 11
  }
];
//generate tournament object
for (var player of playerList) {
  //player.points = Math.random();
  player.games = [];
}

//calculates winPercentage for players
function calcWinPercent(player) {
  return player.points / ((podSize - 1) * currentRound);
}
//order players by points
function nextRound() {
  currentRound++;
  playerList = _.orderBy(playerList, calcOWP, ["desc"]);
  playerList = _.orderBy(playerList, e => e.points, ["desc"]);
  for (var i = 0; i < playerList.length / podSize; i++) {
    var game = { round: currentRound, playerIds: [] };
    for (var j = 0; j < podSize; j++) {
      game.playerIds.push(playerList[i * podSize + j].id);
    }
    for (var j = 0; j < podSize; j++) {
      playerList[i * podSize + j].games.push(game);
    }
  }
}

//calculate OWP
function calcOWP(player) {
  var opponentWinPList = [];
  for (var game of player.games) {
    for (var playerId of game.playerIds) {
      if (playerId != player.id) {
        opponentWinPList.push(
          calcWinPercent(_.find(playerList, e => e.id == playerId))
        );
      }
    }
  }
  return isNaN(
    opponentWinPList.reduce((a, b) => a + b, 0) / opponentWinPList.length
  )
    ? 0
    : opponentWinPList.reduce((a, b) => a + b, 0) / opponentWinPList.length;
}
