const Configuration = require('./bot.config.js')
const Discord = require("discord.js");
const request = require("request");

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

var Champions = new Array;

request(`https://las.api.pvp.net/api/lol/las/v1.2/champion?freeToPlay=false&api_key=${ Configuration.RiotToken }`,function(error, response, body){
    Champions = JSON.parse(body);
    console.log('List of champions retrieved');
});

client.on('message', msg => {
    let message = msg.content.split(' ');
    console.log("Message received:" + message );
    if (message[0] === `${Configuration.CommandPrefix}myStats`) {

        if (message.length != 3) {
            message.reply(`Cantidad incorrecta de argumentos: ${ Configuration.CommandPrefix }myStats {summoner_name} {season_numer}`);
        }

        message.splice(0,1);

        let summoner_name = message[0].toLowerCase();
        let year = message[1];

        try {
            request(`https://las.api.pvp.net/api/lol/las/v1.4/summoner/by-name/${ summoner_name }?api_key=${ Configuration.RiotToken }`, function(error, response, body){
                let summoner = JSON.parse(body);
                request(`https://las.api.pvp.net/api/lol/las/v1.3/stats/by-summoner/${ summoner[summoner_name].id }/summary?season=SEASON${ year }&api_key=${ Configuration.RiotToken }`,function(error, response, body){
                    let summonerStats = JSON.parse(body);
                    console.log(summonerStats);
                    //message.reply(`Tu champion más jugado es ${body}`);
                });
            });
        } catch (e) {

        } finally {

        }
    }
});

client.login(Configuration.DiscordToken);
