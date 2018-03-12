var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'facebook_social'
});
 
connection.connect(function(err){
	if (err) {
		var error = {
			status: 0,
			message: "Error in execution"
		}
		res.send(error);
	} else {
		console.log("database is working");	
	}
});

module.exports = connection;