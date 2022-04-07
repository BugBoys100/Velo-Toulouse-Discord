const Discord = require("discord.js");
const { MessageEmbed, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const settings = require('../../botconfig/settings.json')
var ee = require("../../botconfig/embed.json");
const request = require('request')
var db = require('../../db/db.json')
const stations = require('../../toulouse.json')
const fs = require('fs')

function Savebdd() {
    fs.writeFile("./db/db.json", JSON.stringify(db, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

module.exports = {
    name: "favoris", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Vélib", //the command category for helpcmd [OPTIONAL]
    aliases: ["fav", "favori"], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "favoris", //the command usage for helpcmd [OPTIONAL]
    description: "Gère ses stations mises en favori.", //the command description for helpcmd [OPTIONAL]
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
            var db = require('../../db/db.json')

            try {
                if (!db[message.author.id] || db[message.author.id].length == 0) {
                    liste = '`Aucun favoris`'
                }
                else {
                    var liste = ""
                    for (var i = 0; i < db[message.author.id].length; i++) {
                        for (keys in stations) {
                            if (stations[keys]['number'] == db[message.author.id][i]) {
                                liste = liste + `- ${stations[keys]['name']}\n`
                            }
                        }
                    }
                }

                var premier_etage = []

                var lg_fav = db[message.author.id].length
               
                for (var i = 0; i < lg_fav; i++) { premier_etage.push(new MessageButton().setCustomId('get' + db[message.author.id][i]).setLabel('Infos sur ' + db[message.author.id][i]).setStyle('PRIMARY')) }

                    var composants = [
                        {
                            type: 1,
                            components: premier_etage
                        }
                    ]
                    
                if (lg_fav > 0) message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter({ text: ee.footertext, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Tes favoris ${message.author.username}`)
                        .setDescription(`__Favoris :__
                    
                    \`\`\`${liste}\`\`\``)
                    ], components: composants
                })
                else message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter({ text: ee.footertext, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Tes favoris ${message.author.username}`)
                        .setDescription(`__Favoris :__
                    
                    ${liste}`)
                    ]})
            }
            catch {
                message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter({ text: ee.footertext, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Tes favoris ${message.author.username}`)
                        .setDescription(`__Favoris :__
                    
                    \`Aucun favori\``)
                    ]
                })
            }
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
