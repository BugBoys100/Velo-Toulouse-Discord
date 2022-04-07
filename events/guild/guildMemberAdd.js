const auto_roles = {"❱❱ Membres": "957261934019870784"}

const fs = require('fs')
const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = (client, member) => { 
    if (member.guild.id == '957261934019870780') {
        const channel_welcome = client.channels.cache.get(settings.welcome_channel)
        channel_welcome.send(`Hey <@${member.id}> (**${member.user.username}**), Bienvenue dans **Vélo - Toulouse | Bot Support**`)
    
        let role = member.guild.roles.cache.get(auto_roles['❱❱ Membres'])
        member.roles.add(role)
    }
}