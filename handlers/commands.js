const {
    readdirSync
} = require("fs");
module.exports = (client) => {
    try {
        let amount = 0;
        readdirSync("./commands/").forEach((dir) => {
            const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
            for (let file of commands) {
                let pull = require(`../commands/${dir}/${file}`);
                if (pull.name) {
                    client.commands.set(pull.name, pull);
                    amount++;
                } else {
                    console.log(file, `erreur -> il manque un help.name, ou help.name n'est pas un str.`.brightRed);
                    continue;
                }
                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
            }
        });
        console.log(`${amount} Commandes Chargées`.brightGreen);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};