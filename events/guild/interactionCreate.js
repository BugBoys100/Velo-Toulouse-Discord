//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
const stations = require('../../toulouse.json')
var db = require('../../db/db.json')
const fs = require('fs')
const request = require('request')
const { MessageEmbed, MessageButton } = require('discord.js')

function Savebdd() {
	fs.writeFile("./db/db.json", JSON.stringify(db, null, 4), (err) => {
		if (err) message.channel.send("Une erreur est survenue.");
	});
}


function ItemDansListe(obj, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}

	return false;
}


function EnleverItemListe(obj, list) {
	for (var i = 0; i < list.length; i++) {

		if (list[i] === obj) {

			list.splice(i, 1);
		}

	}
}

module.exports = (client, interaction) => {
	const CategoryName = interaction.commandName;
	let command = false;
	try {
		if (interaction.componentType == 'BUTTON') {
			if (interaction.customId.startsWith('favori')) {
				if (db[interaction.user.id].length == 9) return interaction.reply({ content: `Tu ne peux pas avoir plus de 9 favoris, tu peux les gérer dans la commande \`!favoris\`.`, ephemeral: true })
				var send = false
				const id = interaction.customId.slice(6)
				if (ItemDansListe(id, db[interaction.user.id])) {
					return interaction.reply({ content: `Tu as déjà cette station dans tes favoris !`, ephemeral: true })
				};
				for (key in stations) {
					if (stations[key]['number'] == parseInt(id)) {
						db[interaction.user.id].push(id)
						Savebdd()
						var send = true
					}
				}
				if (send) {
					interaction.reply({ content: `Favori ajouté avec succès !`, ephemeral: true })
				}
				else {
					interaction.reply({ content: `Erreur, le favori n'a pas pu être ajouté.`, ephemeral: true })
				}
			}
			else if (interaction.customId.startsWith('del')) {
				const id = interaction.customId.slice(3)
				if (!ItemDansListe(id, db[interaction.user.id])) return interaction.reply({ content: `Tu n'as pas la station ${id} dans tes favoris !`, ephemeral: true })

				var index = db[interaction.user.id].indexOf(id);
				if (index !== -1) {
					db[interaction.user.id].splice(index, 1);
				}
				Savebdd()
				interaction.reply({ content: `Item supprimé avec succès !`, ephemeral: true })
			}
			else if (interaction.customId.startsWith('get')) {
				const station = interaction.customId.slice(3)
				const lien = `https://api.jcdecaux.com/vls/v1/stations?contract=Toulouse&apiKey=${settings.velo_toulouse_api_key}`

				let options_json = { json: true };
				request(lien, options_json, (error, res, body) => {
					if (error) {
						return console.log(error)
					};

					if (!error && res.statusCode == 200) {
						send = false
						for (key in body) {
							if (body[key]['number'] == station) {
								if (body[key]['status'] == 'OPEN') var statut = ':white_check_mark:'
								else var statut = ':x:'
								if (body[key]['bonus'] == 'true') var bonus = ':white_check_mark:'
								else var bonus = ':x:'
								const embed_rep = new MessageEmbed()
									.setColor(ee.color)
									.setFooter({text: ee.footertext, iconURL: client.user.displayAvatarURL()})
									.setTitle(`${body[key]['name']} | Statut : ${statut}`)
									.addField(`Numéro : `, String(body[key]['number']) || 'Inconnu', true)
									.addField(`Addresse : `, String(body[key]['address']) || 'Inconnue', true)
									.addField(`Position : `, `Latitude : \`${String(body[key]['position']['lat'])}\`\nLongitude : \`${String(body[key]['position']['lng'])}\`` || 'Inconnue', true)
									.addField(`Vélos disponibles : `, `\`${String(body[key]['available_bikes']) || 'Erreur'} / ${String(body[key]['bike_stands']) || 'Erreur'}\``)
									.addField(`Places libres : `, `\`${String(body[key]['available_bike_stands']) || 'Erreur'} / ${String(body[key]['bike_stands']) || Erreur}\``)
									.addField(`Mise à jour : `, `<t:${parseInt(String(body[key]['last_update']).slice(0, 10))}:T>`)
									.addField(`:gift: **__Bonus :__** `, bonus)
									.addField(`Lien Maps : `, `[LIEN](https://www.google.com/maps/place/${String(body[key]['position']['lat'])}+${String(body[key]['position']['lng'])}/)`)
								interaction.reply({ embeds: [embed_rep], ephemeral: true })
								send = true
							}
						}
						if (!send) interaction.reply({
							embeds: [new MessageEmbed()
								.setColor(ee.wrongcolor)
								.setTitle(`Station inconnue`)
								.setDescription(`La station \`${station}\` est introuvable dans la base de donnée, merci de vérifier son nom et de réessayer.`)
							], ephemeral: true
						})
					}
				})

			}
		}

		if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
			command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
		}
	} catch {
		if (client.slashCommands.has("normal" + CategoryName)) {
			command = client.slashCommands.get("normal" + CategoryName);
		}
	}


	if (command) {
		if (onCoolDown(interaction, command)) {
			return interaction.reply({
				ephemeral: true,
				embeds: [new Discord.MessageEmbed()
					.setColor(ee.wrongcolor)
					.setFooter(ee.footertext, client.user.displayAvatarURL())
					.setTitle(replacemsg(settings.messages.cooldown, {
						prefix: prefix,
						command: command,
						timeLeft: onCoolDown(interaction, command)
					}))]
			});
		}
		//if Command has specific permission return error
		if (command.memberpermissions && command.memberpermissions.length > 0 && !interaction.member.permissions.has(command.memberpermissions)) {
			return interaction.reply({
				ephemeral: true, embeds: [new Discord.MessageEmbed()
					.setColor(ee.wrongcolor)
					.setFooter(ee.footertext, client.user.displayAvatarURL())
					.setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
					.setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
						command: command,
						prefix: prefix
					}))]
			});
		}
		//if Command has specific needed roles return error
		if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
			return interaction.reply({
				ephemeral: true, embeds: [new Discord.MessageEmbed()
					.setColor(ee.wrongcolor)
					.setFooter(ee.footertext, client.user.displayAvatarURL())
					.setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
					.setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
						command: command,
						prefix: prefix
					}))]
			})
		}
		//if Command has specific users return error
		if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
			return message.channel.send({
				ephemeral: true, embeds: [new Discord.MessageEmbed()
					.setColor(ee.wrongcolor)
					.setFooter(ee.footertext, client.user.displayAvatarURL())
					.setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
					.setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
						command: command,
						prefix: prefix
					}))]
			});
		}
		//execute the Command
		command.run(client, interaction, interaction.member, interaction.guild)
	}
}
