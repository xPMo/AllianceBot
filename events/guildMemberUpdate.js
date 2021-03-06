const cl = require("../util/chatinfo.js");

module.exports = (bot, oldMember, newMember) => {
	if (!oldMember || !newMember || !oldMember.displayName || !newMember.displayName) {
		return;
	}
	if (oldMember.displayName !== newMember.displayName && !newMember.user.bot) {
		cl.writeLineToAllLogs(bot, newMember.guild, `${oldMember.displayName} is now known as ${newMember.displayName}`);
	}
};
