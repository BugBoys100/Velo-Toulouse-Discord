const Discord = require("discord.js");
const { MessageEmbed, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const settings = require('../../botconfig/settings.json')
var ee = require("../../botconfig/embed.json");
const request = require('request')
module.exports = {
    name: "station", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Vélib", //the command category for helpcmd [OPTIONAL]
    aliases: ["stations", "places", "place"], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "station [nom de la station]", //the command usage for helpcmd [OPTIONAL]
    description: "Donne les infos sur une station Vélo Toulouse", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 1, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try {
            const lien = `https://api.jcdecaux.com/vls/v1/stations?contract=Toulouse&apiKey=${settings.velo_toulouse_api_key}`

            let options = { json: true };
            request(lien, options, (error, res, body) => {
                if (error) {
                    return console.log(error)
                };

                if (!error && res.statusCode == 200) {
                    send = false
                    for (key in body) {
                        if (body[key]['name'].slice(8) == String(args.join(' ').toUpperCase())) {
                            if (body[key]['status'] == 'OPEN') var statut = ':white_check_mark:'
                            else var statut = ':x:'

                            const favori = new MessageButton()
                                .setCustomId('favori' + body[key]['number'])
                                .setLabel('Ajouter aux favoris')
                                .setStyle('PRIMARY')
                                .setEmoji('💛')

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
                            message.reply({ embeds: [embed_rep] , components: [
                                {
                                  type: 1,
                                  components: [favori],
                                }
                              ]})
                            send = true
                        }
                    }
                    if (!send) message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setTitle(`Station inconnue`)
                            .setDescription(`La station \`${String(args.join(' '))}\` est introuvable dans la base de donnée, merci de vérifier son nom et de réessayer.`)
                        ]
                    })
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, client.user.displayAvatarURL())
                    .setTitle(`❌ ERREUR | Une erreur est apparue`)
                    .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
                ]
            });
        }
    }
}
