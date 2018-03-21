var md5 = require('md5');
var connection = require('../modules/connection');
var responses = require('../modules/responses');
var comFunc = require('../modules/commonFunction');
var async = require ('async');
var _ =require('lodash');
var arr=[];
// For signup
exports.signup = function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	

	var manValue = [name, email, countrycode, phonenum, password, confirmpass];
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
          
                    if (err) {
                        responses.sendError(res);
                    } else if(result.length>0) {
                        responses.success(res, result[0]);
                    } else {
                    	console.log("nodata");
                    	responses.nodata(res);
                    }
             
                  });
            }
        });

    }
}
exports.statusupdate = function(req, res) {
    var post_contant=req.body.post;

    var status = req.body.post;
    var access_token = req.body.access_token;
    var user_id = req.body.user_id;
    console.log(access_token);

    var manValue = [status, access_token];
    var checkBlank = comFunc.checkBlank(manValue);

    if (checkBlank == 1) {

        responses.parameterMissing(res);
    } else {
    	// var sql = SELECT 'user_id' from `user` WHERE `access_token` = ?;
    	// connection.query(sql, access_token function(err , result){
    	// 	var user_id=result[0].user_id;
         //another way of finding userid
    	// });
        console.log('access');
        var date = new Date();
        var post_id = md5(new Date());
        var status_sql = "INSERT INTO `status_table`(`post_id`, `user_id`, `post_contant`, `updated_on`) VALUES(?,?,?,?)";
        var values = [post_id, user_id, status, date];
        connection.query(status_sql, values, function(err, result) {
            if (err) {
                console.log(err);
                responses.sendError(res);
            } else {
            	var sql = "SELECT * from `status_table` WHERE `post_id`=?"
            	connection.query(sql, [post_id], function(err, result){
            		if(err){
            			responses.sendError(res);
            		}else{
            			console.log('success');
                		responses.success(res, result);
            		}
            	});
               
            }
        });
    }

}
exports.get_post_list = function(req, res) {
    var access_token = req.body.access_token;
    console.log(access_token);
    var user_id = req.body.user_id;
    var manValue = [access_token];
    var checkBlank = comFunc.checkBlank(manValue);
    let arr = [];

    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {
        var user_sql = "SELECT `user_id` FROM `user` WHERE `access_token`=?";
        connection.query(user_sql, [access_token], function(err, userresult) {
            if (err) {
                responses.sendError(res);
            } else {
                var user_id = userresult[0].user_id;
                console.log(user_id); 
                if (userresult.length == 0) {
                	responses.invalidaccesstoken(res);
                } else {
                    var post_sql = "SELECT * FROM `status_table` ORDER BY `row_id` DESC";
                    connection.query(post_sql, [], function(err, postList) {
                        if (err) {
                            responses.sendError(res);
                        } else {
                            // when we want to merge different responses from  different - different table and to use as one we use async.eachSeries 
                        	async.eachSeries(postList, processData, function(err) {
                                if (err) {
                                    responses.sendError(res);
                                } else {
                                    responses.success(res, arr);
                                    console.log(arr);
                                }
                            });
                            function processData(post, callback) {
                                console.log(12345);
                                
                               //let user_id = post.user_id;
                                var sql = "SELECT `name` FROM `user` WHERE `user_id` = ?";
                                connection.query(sql, [user_id], function(err, result) {

                                    if (err) {
                                        responses.sendError(res);
                                    } else { 
                                        if(result && result[0]){
                                            arr.push(_.merge({
                                                name: result[0].name
                                            }, post));
                                        }
                                        callback();
                                    }
                                });
                            }

                        }
                    });
                }
            }
        });
    }
}
exports.like_list = function(req, res) {

    
    var post_id = req.body.post_id;
    var access_token = req.body.access_token;
    var manValue = [access_token];
    var checkBlank = comFunc.checkBlank(manValue);
    var date = (new Date());
    var like_id = md5(new Date());

    if (checkBlank == 1) {
        responses.parameterMissing(res);
    } else {

        var sql = "select `user_id` FROM `user` where `access_token`= ?";
        connection.query(sql, [access_token], function(err, result) {
            if (err) {
                console.log(err);
                responses.sendError(res);
            } else {
                var user_id = result[0].user_id;
                console.log(user_id);
                var sql = "select * from `like_list` where `liked_by`=? AND `post_id`=?";
                VALUES = [user_id, post_id];
                connection.query(sql, VALUES, function(err, result) {
                    if (err) {
                        console.log(err);
                        responses.sendError(res);
                    } else if (result.length == 0) {
                        var sql = "INSERT into `like_list`(`like_id`,`post_id`,`liked_by`,`like_date`) VALUES(?,?,?,?)";
                        values = [like_id, post_id,user_id,date];
                        connection.query(sql,values, function(err) {
                            if (err) {
                                console.log(err);
                                responses.sendError(res);
                            } else {
                                var sql = "select `like_id`,`liked_by` from `like_list` where `post_id` = ?";
                                connection.query(sql, [post_id], function(err, result) {
                                    if (err) {
                                        console.log(err);
                                        responses.sendError(res);
                                    } else {
                                        responses.success(res, result);
                                    }
                                });
                            }
                        });
                    } else {
                        var sql = "DELETE FROM `like_list` where `liked_by` = ? AND `post_id`=?";
                        VALUES = [user_id, post_id];
                        connection.query(sql, VALUES, function(err) {
                            if (err) {
                                console.log(err);
                                responses.sendError(res);
                            } else {
                                var sql = "select `like_id`,`liked_by` from `like_list` where `post_id` = ?";
                                connection.query(sql, [

                                    post_id], function(err, result) {
                                    if (err) {
                                        console.log(err);
                                        responses.sendError(res);
                                    } else {
                                        responses.success(res, result);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

