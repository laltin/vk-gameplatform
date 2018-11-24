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
 console.log('current_match_id: ' + user.current_match_id);
 if (!user.current_match_id) {
    return null;
 }
 // TODO: find only in not ended matches
 return Match.findOne({ _id:user.current_match_id, game_ended: false }).exec();
}

exports.createMatch = async function(name, players_list, data, playerIndex) {
 var match = new Match({
  game_name: name,
  players: players_list,
  state: data,
  active_player: playerIndex,
  game_ended: false
 });
 let saved = await match.save();
 let id = saved._id;

 console.log(id);
 for (let i=0; i < players_list.length; i++) {
    await User.updateOne({ id:players_list[i] }, { current_match_id: id });
 }
}

exports.updateMatch = async function(match_id, data, newPlayerIndex, game_ended) {
 return Match.updateOne({_id:match_id}, {state: data, active_player: newPlayerIndex, game_ended: game_ended});
}