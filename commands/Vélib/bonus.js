const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const settings = require('../../botconfig/settings.json')
var ee = require("../../botconfig/embed.json");
const request = require('request')
module.exports = {
    name: "bonus", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Vélib", //the command category for helpcmd [OPTIONAL]
    aliases: [], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "bonus", //the command usage for helpcmd [OPTIONAL]
    description: "Donne la liste des stations bonus de Toulouse", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
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
                    resultat = ''
                    for (key in body) {
                        if (body[key]['bonus'] == true){
                            resultat = resultat + `\n- **${body[key]['name'].slice(8)}**`
                            send = true
                        }
                    }
                    if (!send) message.reply({ embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`Aucun bonus pour le moment`)
                        .setFooter(ee.footertext, client.user.displayAvatarURL())
                    ]})
                    else message.reply({ embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, client.user.displayAvatarURL())
                        .setTitle(`Stations bonus :`)
                        .setDescription(resultat)
                    ]})
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
