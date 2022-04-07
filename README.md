# Velo-Toulouse-Discord
Un but Utilisant l'API de [Vélo Toulouse](https://data.toulouse-metropole.fr/explore/dataset/api-velo-toulouse-temps-reel/information/)

## Pré-requis 😀

Pour pouvoir utiliser Velo-Toulouse-Discord, il vous faut : 

- [Node JS 16.14](https://nodejs.org/en/) ou supérieur
- Module [Discord.js](https://www.npmjs.com/package/discord.js?source=post_page-----7b5fe27cb6fa----------------------)

## Installation 📲

Pour installer les modules nécéssaires, faites `npm i`
Avant de lancer le bot, n'oubliez pas de remplir le token du bot dans `botconfig/config.json` (pour en avoir un, créez une application [ici](https://discord.com/developers/applications)), au passage, dans la catégorie `Bot` de l'application, activer les trois intents. Ensuite, faites une demande de [clé API Vélo Toulouse JC Déceaux Développers](https://developer.jcdecaux.com/#/account)
Pour finir, n'oubliez pas d'ajouter votre bot à votre serveur. Notez bien de lui permettre d'ajouter des slashsCommands.
## Démarrage du bot 1️⃣

Pour lancer le bot, après avoir fait la partie **Installation**, faites la commande `node index.js`.

## Liste des commandes

Il y a deux catégories de commandes : 

```Les slash-Commands :```
- /station : Envoie les infos sur une station Vélo Toulouse
- /id : Envoie des infos sur une station Vélo Toulouse par l'id de la station
- /bonus : Envoie la liste de toutes les stations bonus de Vélo Toulouse
- /report : Signale un bug au staff du bot (configurer le channel dans le fichier).

```Les commandes "classiques" :```
- help : Donne des infos sur les commandes du bot
- botinfo : Renvoie des infos sur le bot
- commandcount : Donne le nombre de commande qu'à le bot
- invite : Affiche le lien d'invitation du bot
- ping : Renvoie le ping du bot
- support : Donne le lien d'invitation au serveur de support du bot
- uptime : Affiche le temps depuis lequel le bot est en ligne
- bonus : Envoie la liste de toutes les stations bonus de Vélo Toulouse
- favoris : Affiche toute les stations mises en favoris d'un membre
- station : Donne des infos sur une station Vélo Toulouse
- suppfavoris : Supprime un favoris par son id

## Fabriqué avec 🤝

* [discord-js-v13](https://pypi.org/project/requests/) - Base du programme (merci :))

## Prochainement ... 🤔

Les modifications ou ajouts à venir :
- Ajout d'une meilleure gestion des favoris (en une seule commande plutôt que dans deux)
- Reconversion de toutes les commandes en slashCommand

## Auteur ✏️
* **Bug Boys** _alias_ [@BugBoys100](https://github.com/BugBoys100)

## License ©️

Ce projet est sous licence ``Eclipse Public License 2.0`` - voir le fichier [LICENSE.md](LICENSE.md) pour plus d'informations
