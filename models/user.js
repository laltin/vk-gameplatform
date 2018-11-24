var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	name: String,
	id: String,
	current_match_id: String
});

module.exports = mongoose.model("User", userSchema);