const readline = require("readline-promise").default;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var _ = require("lodash");
var podSize = 4;
var currentRound = 0;

//Fill out Players here ahead of time make sure they have a uniqueId!
var playerList = [
  {
    name: "Rebecca Lott"
  },
  {
    name: "Bates Deleon"
  },
  {
    name: "Cheri Craig"
  },
  {
    name: "Rollins Sherman"
  },
  {
    name: "Loraine Fuentes"
  },
  {
    name: "Sondra Young"
  },
  {
    name: "Chris Holland"
  },
  {
    name: "Bentley Morrison"
  },
  {
    name: "Harrington Poole"
  },
  {
    name: "Osborn Joseph"
  },
  {
    name: "Sallie Carney"
  },
  {
    name: "Jo Sweeney"
  }
];
//generate tournament object
var i = 0;
for (var player of playerList) {
  //player.points = Math.random();
  player.games = [];
  player.id = i;
  player.points = 0;
  i++;
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

//don't worry about the async keyword it's just a fancier way of doing promises
async function runTournament() {
  while (true) {
    nextRound();
    console.log(`Here are the parings for round ${currentRound}:`);
    playerList.forEach((player, i) => {
      console.log(
        `Pod:${Math.floor(i / podSize) + 1} Name: ${player.name} Points: ${
          player.points
        } OWP: ${calcOWP(player)}`
      );
    });
    console.log("Please enter the results for round " + currentRound);
    for (player of playerList) {
      var points = await rl.questionAsync(
        `How many points did ${player.name} score?`
      );
      if (isNaN(parseInt(points))) {
        points = await rl.questionAsync(
          `That's not a number... How many points did ${player.name} score?`
        );
      }
      player.points += parseInt(points);
      console.log(player);
    }
  }
}

runTournament();
