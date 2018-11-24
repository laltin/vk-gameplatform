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
const User = require("./models/user");
const Match = require("./models/match");

exports.getListOfGames = async function() {
    return Game.find({}).exec();
}
exports.getGameByName =  async function(name) {
    return Game.findOne({ game_name: name }).exec();
}
exports.updateGame = async function(name, min, max, nlp, source_code) {
 return Game.updateOne({game_name:name}, {minPlayers:min, maxPlayers:max, nlpEndpoint:nlp, source: source_code});
}

var getUserById = async function(user_id) {
 return User.findOne({id:user_id}).exec();
};
exports.getUserById = getUserById;

exports.saveUserById = async function(user_id, username) {
 var user = new User({
  name: username,
  id: user_id
 });
 return user.save();
}

exports.getMatchByUserId = async function(user_id) {
 var user = await getUserById(user_id);
 if (!user.current_match_id) {
    return null;
 }
 return Match.findOne({ id:user.current_match_id }).exec();
}
