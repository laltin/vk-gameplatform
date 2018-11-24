//var fs = require('fs');
//exports.getListOfGames = function() {
//    return [{name:'tic-tac-toe', code:fs.readFileSync('./test-game/ttt.js', "utf8")}];
//}

/********************************************************
DEAR LALTIN
********************************************************/
const mongoose = require('mongoose')

//replace this with your mongodb address
const url = "mongodb://Jaakko:Junction2018@ds161306.mlab.com:61306/vkchatbotgames";
mongoose.connect(url, { useNewUrlParser: true });

const Game = require("./models/game"); //make sure there is something in the directory

exports.getListOfGames = async function() {
    return Game.find({}).exec();
}
