var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
	game_name: String,
	source: String,
    minPlayers: Number,
    maxPlayers: Number,
    nlpEndpoint: String
});

module.exports = mongoose.model("Game", gameSchema);
