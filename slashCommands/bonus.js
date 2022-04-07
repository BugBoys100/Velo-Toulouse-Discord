const { MessageEmbed } = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const request = require('request')
module.exports = {
    name: "bonus", //the command name for the Slash Command
    description: "Envoie toutes les stations bonus de Vélo Toulouse", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        // {"String": { name: "title", description: "Que sera le nom de l'embed ?", required: true }}, //to use in the code: interacton.getString("title")
        // { "String": { name: "station", description: "Station de Vélo", required: true } }, //to use in the code: interacton.getString("description")
        // {"String": { name: "color", description: "Quelle sera la couleur de l'embed ?", required: false }}, //to use in the code: interacton.getString("color")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        // {"Channel": { name: "in_where", description: "Dans quel salon dois-je l'envoyer ?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;

            const station = options.getString("station"); //same as in StringChoices //RETURNS STRING 
            const lien = `https://api.jcdecaux.com/vls/v1/stations?contract=Toulouse&apiKey=${settings.velo_toulouse_api_key}`

            let options_json = { json: true };
            request(lien, options_json, (error, res, body) => {
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
                    if (!send) interaction.reply({ embeds: [new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(`Aucun bonus pour le moment`)
                        .setFooter(ee.footertext, client.user.displayAvatarURL())
                    ], ephemeral: true})
                    else interaction.reply({ embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setFooter(ee.footertext, client.user.displayAvatarURL())
                        .setTitle(`Stations bonus :`)
                        .setDescription(resultat)
                    ], ephemeral: true})
                }
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}