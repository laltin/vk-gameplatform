/********************************************************
Mongoose.js and MongoDB
********************************************************/
const mongoose = require('mongoose')

//replace this with your mongodb address
const url = "mongodb://Jaakko:Junction2018@ds161306.mlab.com:61306/vkchatbotgames";
mongoose.connect(url, { useNewUrlParser: true });

const Game = require("./models/game");   //Model for Game logic
const User = require("./models/user");   //Model for VK user
const Match = require("./models/match"); //Model for a match. Which game, who's playing

//Get a list with all available games
exports.getListOfGames = async function() {
  return Game.find({}).exec();
}

//Find a game object of a certain name
exports.getGameByName =  async function(name) {
  return Game.findOne({ game_name: name }).exec();
}

//Update the game source code and parameters
exports.updateGame = async function(name, min, max, nlp, source_code) {
  return Game.updateOne({game_name:name}, {minPlayers:min, maxPlayers:max, nlpEndpoint:nlp, source: source_code});
}

//Retreive a user by their VK id
var getUserById = async function(user_id) {
 return User.findOne({id:user_id}).exec();
};
exports.getUserById = getUserById;

//Create a new user based on VK profile
exports.saveUserById = async function(user_id, username) {
 var user = new User({
  name: username,
  id: user_id
 });
 return user.save();
}

//Find the match that the user is currently busy with
exports.getMatchByUserId = async function(user_id) {
 var user = await getUserById(user_id);
 console.log('current_match_id: ' + user.current_match_id);
 if (!user.current_match_id) {
    return null;
 }
 // TODO: find only in not ended matches
 return Match.findOne({ $and: [ {_id:user.current_match_id}, {game_ended: false}] }).exec();
}

//Create a new match
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

//Update the game state and progress
exports.updateMatch = async function(match_id, data, newPlayerIndex, game_ended) {
 return Match.updateOne({_id:match_id}, {state: data, active_player: newPlayerIndex, game_ended: game_ended});
}