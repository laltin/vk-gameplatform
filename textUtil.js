exports.findTaggedUsers = function(message) {
    "start game with [id518119582|@jaakkol] [id54519582|@laltin]"
    var str = message 
    var res = str.match(/\B\[id\w+/g)
    var outputarr = []
    res.forEach(element => {
    	outputarr.push(element.substring(3,element.length))
    });
    return outputarr;
};
