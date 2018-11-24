const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const VkBot = require('node-vk-bot-api')
 
const app = express()

const url = "mongodb://Jaakko:Junction2018@ds161306.mlab.com:61306/vkchatbotgames";
mongoose.connect(url, { useNewUrlParser: true });


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const User = require("./models/user");
const Match = require("./models/match");
const Game = require("./models/game"); //make sure there is something in the directory



/************************************************
ROUTES
************************************************/

app.get('/', function(req,res) {
    res.sendFile(__dirname+'/views/index.html');
});

app.get('/games', findAllGames, function(req, res) {
	res.redirect("/");
});

app.post('/games', createGame, function(req, res) {
	res.redirect("/");
});

app.get('/matches', findAllMatches, function(req, res) {
	res.redirect("/");
});

app.get('/matches/:id', findMatch, function(req, res) {
	res.redirect("/");
});

app.post('/matches', saveMatch, function(req, res) {
	res.redirect("/");
});

app.get('/users', findAllUsers, function(req, res) {
	res.redirect("/");
});

app.get('/users/:user', findUser, function(req, res) {
	res.redirect("/");
});

app.post("/users", saveUser, function(req,res) {
	res.redirect("/");
});



/************************************************
'MIDDLEWARE'
************************************************/


function findAllGames(req, res, next) {
	Game.find({}, function(err, foundGames) {
		if(err) {
			console.log(err);
			res.send("error");
		} else {
			res.send(foundGames);
		}
	});
}


function saveUser(req, res, next) {
	var user = {
		name: req.body.name,
		id: req.body.id
	};
	User.create(user, function(err, newUser) {
		if(err) {
			console.log(err);
			res.send("error saving user");
		} else {
			console.log("user saved: " + newUser);
			res.send(newUser);
		}
	});
}

function findUser(req, res, next) {
	User.findOne({name:req.params.user}, function(err, foundUser) {
		if(err) {
			console.log(err);
			res.send("error");
		} else {
			res.send(foundUser);
		}
	});
}

function findAllUsers(req, res, next) {
	User.find({}, function(err, foundUsers) {
		if(err) {
			console.log(err);
			res.send("error");
		} else {
			res.send(foundUsers);
		}
	});
}

function saveMatch(req, res, next) {
	var match = {
		id: req.body.id,
		game_name: req.body.game_name,
		players: req.body.players,
		state: req.body.state,
		active_player: 0,
		game_ended: false
	};
	Match.create(match, function(err, newMatch) {
		if(err) {
			console.log(err);
			res.send("error saving match");
		} else {
			console.log("match saved: " + newMatch);
			res.send(newMatch);
		}
	});
}

function findMatch(req, res, next) {
	Match.findOne({name:req.params.id}, function(err, foundMatch) {
		if(err) {
			console.log(err);
			res.send("error");
		} else {
			res.send(foundMatch);
		}
	});
}

function findAllMatches(req, res, next) {
	Match.find({}, function(err, foundMatches) {
		if(err) {
			console.log(err);
			res.send("error");
		} else {
			res.send(foundMatches);
		}
	});
}

function createGame(req, res, next) {
	var game = {
		game_name: req.body.game_name
	};
	Game.create(game, function(err, newGame) {
		if(err) {
			console.log(err);
			res.send("error saving match");
		} else {
			console.log("match saved: " + newGame);
			res.send(newGame);
		}
	});
}


/************************************************
'API'
************************************************/


/*

getUserById(user_id)
saveUserById(user_id, name)
getListOfGames()
createMatch(players, data, playerIndex)
getMatch(user_id)

*/




/************************************************
USER
************************************************/

exports.getUserById = async function(user_id) {
	return User.findOne({id:user_id}).exec();
}

exports.getUserByName = async function(user_name) {
	return User.findOne({name:user_name}).exec();
}

exports.saveUserById = async function(user_id, username) {
	var user = {
		name: username,
		id: user_id
	};
	return User.create(user).exec();
}

exports.updatePlayerCurrentMatch = async function(user_id, new_match_id) {
	return User.updateOne({id:user_id}, {current_match_id: new_match_id});
}

/************************************************
GAME
************************************************/

exports.getListOfGames = async function() {
	return Game.find({}).exec();
}

exports.updateGameSource = async function(name, source_code) {
	return Game.updateOne({game_name:name}, {source: source_code});
}

/************************************************
MATCH
************************************************/

exports.createMatch = async function(players_list, data, playerIndex) {
	var match = {
		players: players_list,
		state: data,
		active_player: playerIndex,
		game_ended: false
	};
	return Match.create(match).exec();
}

exports.updateMatch = async function(match_id, data) {
	return Game.updateOne({id:match_id}, {state: data});
}

exports.getMatchByUserId = async function(user_id) {
	var user = await getUserById(user_id);
	if (!user.current_match_id) {
		return null;
	}

	return Match.findOne({id: user.current_match_id}).exec();
}









app.listen(3000, function() {
	console.log("vk_gameplatform db access point");
});