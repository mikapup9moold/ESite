function toJSON(str) {
	var array = str.split(",");
	var len = array.length;
	var obj = {};
	for(i = 0; i < len - 1; i++) {
		var pair = array[i].split("#");
		if(obj[pair[0]] == null) {
			obj[pair[0]] = parseInt(pair[1]);
		} else {
			obj[pair[0]] += parseInt(pair[1]);
		}
	}
	return obj;
}