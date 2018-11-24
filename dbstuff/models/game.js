var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
	game_name: String,
	source: String
});

module.exports = mongoose.model("Game", gameSchema);