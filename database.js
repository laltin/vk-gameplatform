var fs = require('fs');

exports.getListOfGames = function() {
    return [{name:'tic-tac-toe', code:fs.readFileSync('./test-game/ttt.js', "utf8")}];
}
