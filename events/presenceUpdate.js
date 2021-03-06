const colors = require("colors");

const editPlayRole = (type, memb, role, guild) => {
	if (type === "add") {
		memb.addRole(role).then(console.log(colors.white.dim(`* ${memb.displayName} added to ${role.name} role on ${guild.name} server.`))).catch(console.error);
	} else if (type === "del") {
		memb.removeRole(role).then(console.log(colors.white.dim(`* ${memb.displayName} removed from ${role.name} role on ${guild.name} server.`))).catch(console.error);
	}
};

module.exports = (bot, oldMember, newMember) => {
	const guild = newMember.guild;
	let playRole = "";
	if (guild.id === "83078957620002816" || guild.id === "211599888222257152") {
		playRole = guild.roles.find(val => val.name === "Playing Distance");
	}
	if (!playRole || playRole === "") {
		return;
	}

	const botMember = guild.members.get(bot.user.id);
	if ((botMember.hasPermission("MANAGE_ROLES") || botMember.hasPermission(10000000)) && botMember.highestRole.position > newMember.highestRole.position) {

		const oldP = oldMember.user.presence;
		const newP = newMember.user.presence;

		const oldHasStream = (oldP.game) ? oldP.game.streaming : false;
		const oldHasDistance = (oldP.game) ? (oldHasStream) ? oldP.game.details === "Distance" : oldP.game.name === "Distance" : false;
		//const oldHasRole = oldMember.roles.has(playRole.id);

		const newHasStream = (newP.game) ? newP.game.streaming : false;
		const newHasDistance = (newP.game) ? (newHasStream) ? newP.game.details === "Distance" : newP.game.name === "Distance" : false;
		const newHasRole = newMember.roles.has(playRole.id);

		if (newHasDistance && !newHasRole) {
			editPlayRole("add", newMember, playRole, guild);
		} else if (!newHasDistance && newHasRole) {
			editPlayRole("del", newMember, playRole, guild);
		} else if (!oldHasDistance && newHasDistance) {
			editPlayRole("add", newMember, playRole, guild);
		} else if (newHasDistance && !newHasRole) {
			editPlayRole("add", newMember, playRole, guild);
		}

	}
};
