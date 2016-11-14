const md = require("./messagedate.js");
const fs = require("fs-extra");
const logLocation = require("../config/options.json").logLocation;
const prefix = require("../config/options.json").prefix;
const colors = require("colors");
var i = 0;

function formatUptime(seconds) {
	var out = "Bot uptime: ";
	// function pad(s) {
	// 	return (s < 10 ? "0" : "") + s;
	// }
	var days = Math.floor(seconds / (60 * 60 * 24));
	var hours = Math.floor(seconds / (60 * 60));
	var minutes = Math.floor(seconds % (60 * 60) / 60);
	seconds = Math.floor(seconds % 60);

	if (days !== 0) {
		out += days + " day" + ((days !== 1) ? "s" : "") + ", ";
	}
	if (days !== 0 || hours !== 0) {
		out += hours + " hour" + ((hours !== 1) ? "s" : "") + ", ";
	}
	if (days !== 0 || hours !== 0 || minutes !== 0) {
		out += minutes + " minute" + ((minutes !== 1) ? "s" : "") + ", ";
	}
	out += seconds + " seconds";
	return out;

}

var writeLineToAllLogs = function(bot, guild, line) {
	var guildChannels = guild.channels.array();
	var currentDate = new Date();
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	var currentYear = currentDate.getFullYear();
	var currentMonth = monthNames[currentDate.getMonth()];
	i = 0;
	for (i; i < guildChannels.length; i++) {
		//fs.appendFile("channelperms.json", util.inspect(guildChannels[i].permissionsFor(guild.members.get(bot.user.id)).serialize()) + "\r\n\r\n");
		if (guildChannels[i].type === "text" && guildChannels[i].permissionsFor(guild.members.get(bot.user.id)).hasPermissions(["READ_MESSAGES", "SEND_MESSAGES"])) {
			fs.appendFile(logLocation + guild.name + "/#" + guildChannels[i].name + "/" + currentYear + "/" + currentMonth + ".log", "* " + line + "\r\n", function(error) {
				if (error) {
					console.log(error);
				}
			});
			fs.appendFile(logLocation + guild.name + "/full_logs/#" + guildChannels[i].name + ".log", "* " + line + "\r\n", function(error) {
				if (error) {
					console.log(error);
				} else {
					//console.log(colors.white.dim("* " + line));
				}
			});
		}
	}
	console.log(colors.white.dim("* " + line + " on the '" + guild.name + "' server."));
};

var getDisplayName = function(guildMember) {
	if (guildMember.nickname) {
		return guildMember.nickname;
	} else {
		return guildMember.user.username;
	}
};

var getMaxRole = function(user) {
	var nick = null;
	var isbot = "";
	var toprole = "";
	//console.log(user.roles);
	if (user.roles.size === 1) {
		//user = "Guest";
		//console.log(user.roles.find("name","@everyone").position);
		toprole = {
			"position": 0,
			"name": "Guest"
		};
		if (user.user.bot) {
			isbot = "{BOT}";
		}
	} else {
		//console.log(user.bot);
		if (user.user.bot) {
			isbot = "{BOT}";
		}
		var maxpos = 0;
		i = 0;
		for (i; i < user.guild.roles.size + 1; i++) {
			maxpos = user.roles.exists("position", i) && user.roles.find("position", i).position > maxpos ? user.roles.find("position", i).position : maxpos;
		}
		toprole = user.guild.roles.find("position", maxpos);
		if (user.nickname) {
			nick = user.nickname;
		}
	}
	return {
		toprole,
		isbot,
		nick
	};
};

var formatChatlog = function(message) {
	var messageTime = md.messageDate(message);
	var messageContent = message.cleanContent.replace(/<(:[\w]+:)[\d]+>/g, "$1").replace(/(\r\n|\n|\r)/gm, " ");
	var user = getMaxRole(message.guild.members.get(message.author.id));
	var chatlog = logLocation + message.guild.name + "/#" + message.channel.name + "/" + messageTime.year + "/" + messageTime.month + ".log";
	var fullLog = logLocation + message.guild.name + "/full_logs/#" + message.channel.name + ".log";
	var chatlinedata = messageTime.formattedDate + " | " + user.isbot + "(" + user.toprole.name + ")";
	var consoleChat = messageTime.hour + ":" + messageTime.minute + " " + messageTime.ampm + " [" + message.guild.name + "/#" + message.channel.name + "] " + user.isbot + "(" + user.toprole.name + ")";
	var att = [];
	var formattedAtturls = "";
	fs.mkdirsSync(logLocation + message.guild.name + "/#" + message.channel.name + "/" + messageTime.year, function(error) {
		if (error) {
			console.log(error);
			return;
		}
	});
	//console.log(message.member);
	if (message.member.nickname) {
		chatlinedata += message.member.nickname + ": " + messageContent;
		consoleChat += message.member.nickname + ": " + messageContent;
	} else {
		chatlinedata += message.author.username + ": " + messageContent;
		consoleChat += message.author.username + ": " + messageContent;
	}
	if (message.attachments.size > 0) {
		var attc = message.attachments.array();
		i = 0;
		for (i; i < attc.length; i++) {
			att.push(attc[i].url);
		}
		i = 0;
		for (i; i < att.length; i++) {
			formattedAtturls += " " + att[i];
		}
	}
	return {
		user,
		"currentLog": chatlog,
		fullLog,
		chatlinedata,
		consoleChat,
		"atturls": att,
		formattedAtturls
	};
};

var escapeChars = function(word) {
	var escapechars = true;
	var tempWord = word;
	while (escapechars) {
		if (tempWord.includes("\'") && !tempWord.includes("\\\'")) {
			tempWord = tempWord.replace("\'", "\\\'", "g");
		} else if (tempWord.includes("\"") && !tempWord.includes("\\\"")) {
			tempWord = tempWord.replace("\"", "\\\"", "g");
		} else if (tempWord.includes("\\") && !tempWord.includes("\\\\")) {
			tempWord = tempWord.replace("\\", "\\\\", "g");
		} else if (tempWord.includes("\%") && !tempWord.includes("\\\%")) {
			tempWord = tempWord.replace("\%", "\\\%", "g");
		} else if (tempWord.includes("\_") && !tempWord.includes("\\\_")) {
			tempWord = tempWord.replace("\_", "\\\_", "g");
		} else {
			escapechars = false;
		}
	}
	return tempWord;
};

var getComRef = function(hardCode, results) {
	var ref = 0;
	i = 0;
	for (i; i < hardCode.length; i++) {
		if (hardCode[i].name === results[0].replace(prefix, "")) {
			ref = i;
		}
	}
	return ref;
};

module.exports = {
	formatChatlog,
	getMaxRole,
	escapeChars,
	getComRef,
	writeLineToAllLogs,
	getDisplayName,
	formatUptime
};
