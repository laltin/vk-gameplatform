exports.findTaggedUsers = function(message) {
    var str = message 
    var res = str.match(/\B\[id\w+/g)
    var outputarr = []
    res.forEach(element => {
    	outputarr.push(element.substring(3,element.length))
    });
    return outputarr;
};
