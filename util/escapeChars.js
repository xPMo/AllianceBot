const specials = ["-", "[", "]", "/", "{", "}", "(", ")", "*", "+", "'", "?", ".", "\\", "^", "$", "|"];
const regex = RegExp("[" + specials.join("\\") + "]", "g");
module.exports = {
	chars(str) {
		return str.replace(regex, "\\$&");
	}
};
