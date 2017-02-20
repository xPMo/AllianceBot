const pre = require("../config.json").prefix;
const timers = require("../util/timers.js");

exports.run = (bot, msg) => {
	var forSS = {
		"bool": true
	};
	var currentss = timers.getCount(false, "The next SS will begin in ", forSS);
	msg.channel.sendMessage(`${currentss} Use ${pre}speedy for full SS information.`);
};

exports.conf = {
	guildOnly: false,
	aliases: [],
	permLevel: 0,
	onCooldown: false,
	cooldownTimer: 1000
};

exports.help = {
	name: "ss",
	description: "Get the time remaining until the next Speedy Saturday, or the time remaining if it's currently happening.",
	extendedDescription: "",
	usage: "ss"
};
