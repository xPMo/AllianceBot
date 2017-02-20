const num = require("../util/num.js");

exports.run = (bot, msg, args, perm) => {
	var max = 10;
	var min = 1;
	if (args.length > 2 || (args.length <= 1 && perm < 4)) {
		return msg.channel.sendMessage("You can only have one maximum and one minimum.");
	}
	if (args[0] && args[1] && !isNaN(args[0]) && !isNaN(args[1])) {
		max = Math.max(...args);
		min = Math.min(...args);
		if (!(parseInt(min) <= parseInt(max) - 50)) {
			return msg.channel.sendMessage("The minimum must be at least 50 under the max.");
		}
	}
	var rndm;
	num.toggleStatus();
	if (!num.getStatus()) {
		return msg.channel.sendMessage("Stopped random number");
	}
	msg.channel.sendMessage("Started random number");
	rndm = Math.floor(Math.random() * max) + min;
	msg.channel.awaitMessages(response => response.content === `${rndm}`, {
		max: 1,
		time: 15000,
		errors: ["time"],
	}).then((collected) => {
		if (num.getStatus()) {
			var winnerid = collected.first().author.id;
			var scoreAdd = 1;
			num.manageCorrect(msg.channel, collected, winnerid, scoreAdd);
		}
	}).catch(() => {
		if (num.getStatus()) {
			msg.channel.sendMessage("No one guessed correctly!").then(() => {
				num.toggleStatus();
			});
		}
	});
};

exports.conf = {
	guildOnly: false,
	aliases: [],
	permLevel: 0,
	onCooldown: false,
	cooldownTimer: 1000
};

exports.help = {
	name: "num",
	description: "Start a random number guessing game, with custom min and max.",
	extendedDescription: "",
	usage: "num [min|max] [min|max]"
};
