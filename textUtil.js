exports.findTaggedUsers = function(message) {
    var str = message 
    var res = str.match(/\B\[id\w+/g)
    var outputarr = []
    if (!res) {
        return [];
    }
    res.forEach(element => {
    	outputarr.push(element.substring(3,element.length))
    });
    return [outputarr, str.replace(/\B\[id\w\|@\w+/g, "")];
};
