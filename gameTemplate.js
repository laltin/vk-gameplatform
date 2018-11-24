/**
 * param: nPlayers - number of players that joined the game
 * returns: data        - anything you want
 * returns: messages    - an array that contains message contents that will be sent to each player. except `your turn, make you move` stuff, they will be appended by platform
 * returns: playerIndex - index of player starting the game (0, nPlayers-1)
 */
exports.init = function(nPlayers) {
    return [data, messages, playerIndex];
}

/**
 * param: data              - you know what this is
 * param: playerIndex       - index of player making the move
 * param: move              - the input move made by player. this parameter will be one of the strings defined in game settings
 * param: params            - nlp model parameters, if defined in nlp model
 * returns: isValid         - is the move valid. if false you can omit other return parameters
 * returns: reason          - (optional) in case if move is invalid, you can send the reason. (ex: for poker, no budget for raising)
 * returns: nextData        - check init() function
 * returns: messages        - check init() function
 * returns: nextPlayerIndex - check init() function
 */
exports.transition = function(data, playerIndex, move, params) {
    var isValid = /* TODO: check if move is valid for given data */false;

    if (!isValid) {
        return [isValid, reason];
    }

    return [isValid, nextData, messages, nextPlayerIndex];
}

/**
 * param: data
 * returns: false or [messages]
 *   messages: list of messages that will be sent to players, will be appended to transition messages
 */
exports.hasEnded = function(data) {
    var ended = /* TODO: check if game has ended for given data */false;
    if (!ended) {
        return ended;
    }

    return [messages];
}
