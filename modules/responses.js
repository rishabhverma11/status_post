
var constants = require('./constant');

exports.parameterMissing = function(res) {
	var response = {
		response: {},
		message: constants.responseMessages.PARAMETER_MISSING
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
}

exports.sendError = function(res) {
	var response = {
		response: {},
		message: constants.responseMessages.ERROR_IN_EXECUTION
	};
	res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
}

exports.success = function(res, values) {
	var response = {
		response: values,
		message: constants.responseMessages.ACTION_COMPLETE
	};
	res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
}

exports.emailAlreadyExist = function(res) {
	var response = {
		response: {},
		message: constants.responseMessages.EMAIL_ALREADY_EXISTS
	};
	res.status(constants.responseFlags.ALREADY_EXIST).json(response);
}
exports.nodata = function(res) {
	var response ={
		response: {},
		message: constants.responseMessages.NO_DATA_FOUND

	};
	res.status(constants.responseFlags.NO_DATA_FOUND).json(response);

}
// exports.success=function(result,res){
// 	var response={
// 		status:1,
// 		message:result[0]
// 	}
// 	res.send(response);
// }
exports.invalidaccesstoken = function(res) {
	var response = {
		response: {},
		message: constants.responseMessages.INVALID_ACCESS_TOKEN
	};
	res.status(constants.responseFlags.INVALID_ACCESS_TOKEN).json(response);
}
