const fs = require("fs-extra");
require("colors");
const cl = require("../util/chatinfo.js");
const jsdiff = require("diff");

module.exports = (bot, oldMessage, newMessage) => {
	if (bot.user === oldMessage.author || bot.user === newMessage.author) {
		return;
	}
	if (oldMessage.content === newMessage.content) {
		return;
	}

	const newc = cl.formatChatlog(newMessage);
	const oldc = cl.formatChatlog(oldMessage);

	fs.readFile(oldc.currentLog, function(e, data) {
		if (e) {
			console.error(e.stack);
		} else {
			const array = data.toString().split("\r\n");
			let i = 0;
			for (i; i < array.length; i++) {
				if (array[i] === oldc.chatlinedata || array[i] === "(Edited) " + oldc.chatlinedata) {
					array[i] = "(Edited) " + newc.chatlinedata;
				}
			}
			fs.writeFile(oldc.currentLog, array.join("\r\n"), function(e) {
				if (e) {
					console.error(e.stack);
				} else {


					const diff = jsdiff.diffWords(oldc.chatlinedata, newc.chatlinedata);

					let edit = "Edited --> ".grey;
					i = 0;
					diff.forEach(part => {
						const color = (part.added) ? "green" : (part.removed) ? "red" : "grey";
						edit += part.value[color];
					});
					console.log(edit);


					//console.log(colors.white.dim("Edited --> " + newc.consoleChat));
				}
			});
		}
	});
	fs.readFile(oldc.fullLog, function(e, data) {
		if (e) {
			console.error(e.stack);
		} else {
			const array = data.toString().split("\r\n");
			let i = 0;
			for (i; i < array.length; i++) {
				if (!array[i].startsWith("http") && (array[i] === oldc.chatlinedata || array[i] === "(Edited) " + oldc.chatlinedata)) {
					array[i] = "(Edited) " + newc.chatlinedata;
				}
			}
			fs.writeFile(oldc.fullLog, array.join("\r\n"), function(error) {
				if (error) {
					console.error(error);
				} else {
					//console.log(colors.white.dim("Edited --> " + newc.consoleChat));
				}
			});
		}
	});
};
