/**
 * param: nPlayers - number of players that joined the game
 * returns: data        - anything you want
 * returns: messages    - an array that contains message contents that will be sent to each player. except `your turn, make you move` stuff, they will be appended by platform
 * returns: playerIndex - index of player starting the game (0, nPlayers-1)
 */

const COLUMNS = ["a", "b", "c"];
const ROWS = ["1", "2", "3"];

const FIELD_LENGTH = COLUMNS.length;

exports.init = function(nPlayers) {
    
    return [initBoard(), initMessages(), 1];
}

/**
 * param: data              - you know what this is
 * param: playerIndex       - index of player making the move
 * param: move              - the input move made by player. this parameter will be one of the strings defined in game settings
 * returns: isValid         - is the move valid. if false you can omit other return parameters
 * returns: reason          - (optional) in case if move is invalid, you can send the reason. (ex: for poker, no budget for raising)
 * returns: nextData        - check init() function
 * returns: messages        - check init() function
 * returns: nextPlayerIndex - check init() function
 */
exports.transition = function(data, playerIndex, move) {
    let isValid = true;

    move = move.toLowerCase();
    const col = move.charAt(0);
    const row = move.charAt(1);
    if(move.length != 2){
        return [false, "Unknown command"]
    } 
    else if(!COLUMNS.includes(col)){
        return [false, "Unknown position"]
    }
    else if(!ROWS.includes(row)){
        return [false, "Unknown position"]
    }
    
    const indexes = getIndexes(col, row); 

    if(data[indexes.r][indexes.c] != "."){ 
        return [false, "Field already ticked"]
    } 
    else data[indexes.r][indexes.c] = playerToString(playerIndex);


    const nextPlayerIndex = getNextPlayerIndex(playerIndex);

    const printedState = printState(data);

    return [true, data, [printedState, printedState], nextPlayerIndex];
}
/**
 * param: data
 * returns: false or [messages]
 *   messages: list of messages that will be sent to players, will be appended to transition messages
 */
exports.hasEnded = function(data) {

    //one diagonal direction
    if(data[0][0] == data[1][1] && data[0][0] == data[2][2]){
        if(data[0][0] == "O") return ["Player1 won!"];
        else if(data[0][0] == "X") return ["Player2 won!"];
    }

    //other diagonal direction
    if(data[0][2] == data[1][1] && data[0][2] == data[2][0]){
        if(data[0][2] == "O") return ["Player1 won!"];
        else if(data[0][2] == "X") return ["Player2 won!"];
    }

    //columns
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[0][i] == data[1][i] && data[0][i] == data[2][i]){
            if(data[0][i] == "O") return ["Player1 won!"];
            else if(data[0][i] == "X") return ["Player2 won!"];
        }
    }

    //rows
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[i].every(field => field == "O")){
            return ["Player1 won!"];
        }

        if(data[i].every(field => field == "X")){
            return ["Player2 won!"];
        }
    }

    //are there fields left
    for(let i=0; i<FIELD_LENGTH; ++i){
        if(data[i].some(field => field == ".")){
            return false;
        }
    }

    return ["Draw, no empty fields left"];
}

//create empty board
function initBoard(){
    let board = new Array();
    
    for(let i=0; i<FIELD_LENGTH; ++i){
        let column = Array();
        for(let j=0; j<FIELD_LENGTH; ++j) column.push('.');
        board.push(column);
    }
    return board;
}

function initMessages(){
    return "Player 1 up first, have a good game!"
}

//convert index string to numbers
function getIndexes(col, row){
    const rowInd = parseInt(row)-1;
    let colInd
    switch(col){
        case "a":
            colInd = 0;
            break;
        case "b":
            colInd = 1;
            break;
        case "c":
            colInd = 2;
            break;
    }

    return {
        c: colInd,
        r: rowInd
    }
}

function getNextPlayerIndex(currPlayerIndex){
    return currPlayerIndex % 2 + 1;
}

function playerToString(playerIndex){
    if(playerIndex == 1) return "O";
    else return "X";
}

 function printState(data){
    let msg = "The current state of the board is:\n";
    
    msg += "  ";
    msg += COLUMNS.join(" ");
    msg += "\n";

    let rowStrings = [];
    for(let i=0; i<FIELD_LENGTH; ++i){
        rowStrings.push(ROWS[i] + " " + data[i].join(" "));
    }
    msg += rowStrings.join("\n");
    msg +=("\n");
    return msg;
}
