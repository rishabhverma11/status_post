var md5 = require('md5');
var connection = require('../modules/connection');
var responses = require('../modules/responses');
var comFunc = require('../modules/commonFunction');

// For signup
exports.signup = function(req, res) {

	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	var manValue = [name, email, password];
	var checkBlank = comFunc.checkBlank(manValue);

	if ( checkBlank == 1 ) {
		responses.parameterMissing(res);
	} else {
		var sql = "SELECT * FROM `user` WHERE `email`=?";
		connection.query(sql, [email], function(err, result){
			if ( err ) {
				responses.sendError(res);
			} else {
				if ( result.length > 0 ) {
					responses.emailAlreadyExist(res);
				} else {
					var user_id = md5(new Date());
					var access_token = md5(new Date());

					var insert_sql = "INSERT INTO `user`(`user_id`, `access_token`, `name`, `email`, `password`) VALUES(?,?,?,?,?)";
					var values = [user_id, access_token, name, email, md5(password)];
					connection.query(insert_sql, values, function(err, result){
						if ( err ) {
							responses.sendError(res);
						} else {
							var sql = "SELECT * FROM `user` WHERE `email`=?";
							connection.query(sql, [email], function(err, result){
								if ( err ) {
									responses.sendError(res);
								} else {
									result[0].password = "";
									responses.success(res, result[0]);
								}
							});
						}
					});
				}
			}
		});
	}
}
//for login
exports.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;


    var manvalue = [email, password];
    var checkblank = comFunc.checkBlank(manvalue);

    if (checkblank == 1) {
        responses.parameterMissing(res);
    } else {
        var access_token = md5(new Date());
        var update_token_sql = "update `user` set `access_token`=? WHERE `email`=?";
        values = [access_token, email];
        connection.query(update_token_sql, values, function(err, result) {
            if (err) {
                responses.sendError(res);
                return;
            } else {
                var login_sql = "SELECT * from `user` WHERE `email`=? AND `password`=?";
         
                values = [email, md5(password)];
                connection.query(login_sql, values, function(err, result) {
                	console.log(result);
                    if (err) {
                        responses.sendError(res);
                    } else {
                        responses.success(res, result[0]);
                    }
                });
            }
        });

    }
}
exports.statusupdate = function(req, res) {

    var status = req.body.post;
    var access_token = req.body.access_token;
    console.log(access_token);

    var manValue = [status, access_token];
    var checkBlank = comFunc.checkBlank(manValue);

    if (checkBlank == 1) {

        responses.parameterMissing(res);
    } else {
        console.log('access');
        var date = new Date();
        var post_id = md5(new Date());


        var sql = "SELECT `user_id` from `user` WHERE `access_token`=?";
        connection.query(sql, [access_token], function(err, result) {
            console.log(result);
            if (err) {
                responses.sendError(res);

            } else {
               		var user_id = result[0].user_id;


                var status_sql = "INSERT INTO `status_table`(`post_id`, `user_id`, `post_contant`, `updated_on`) VALUES(?,?,?,?)";
                var values = [post_id, user_id, status, date];
                connection.query(status_sql, values, function(err, result) {
                    if (err) {
                        console.log(err);
                        responses.sendError(res);
                    } else {
                        console.log('success');
                        responses.success(res, result[0]);
                    }
                });
            }
        });

    }

}



exports.viewUser = function(req, res){
 	var access_token = req.body.access_token;
 	console.log(access_token);
 	console.log("hii");
 	var sql = "SELECT `user_id`,`name` from `user` WHERE `access_token`= access_token";
 	connection.query(sql,[access_token],function(err,result){
 		if(err) {
 			console.log("error occure");
 			responses.sendError(res);
 		} else {
 			console.log("success");
 			//responses.success(res,result[0]);
 			res.send(result);
 		}
 	})
}