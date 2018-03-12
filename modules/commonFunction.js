exports.generateRandomString = function(){
	var text = "";
	var possible = "123456789";

	for (var i = 0; i < 4; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	 return text;
}

exports.checkBlank = function(arr) {
	var arrlength = arr.length;
	for (var i = 0; i < arrlength; i++) {
		if (arr[i] === undefined) {
			arr[i] = "";
		} else {
			arr[i] = arr[i];
		}
		arr[i] = arr[i].trim();
		if (arr[i] === '' || arr[i] === "" || arr[i] == undefined) {
			return 1;
			break;
		}
	}
	return 0;
}