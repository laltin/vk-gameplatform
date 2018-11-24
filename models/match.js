var mongoose = require("mongoose");

var matchSchema = new mongoose.Schema({
	id: String,
	game_name: String,
	players: [String], //json
	state: String, //json
	active_player: Number,
	game_ended: Boolean 
});

module.exports = mongoose.model("Match", matchSchema);