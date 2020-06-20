const Discord = require("discord.js");
const client = new Discord.Client(); 
const config = require("./config.json"); 

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores`);
    client.user.setActivity("gameplay de qualidade", {type: "STREAMING", url: "https://www.twitch.tv/cordezera"});
});

client.on("guildCreate", guild => {
   console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} Membros`); 
   client.user.setActivity("gameplay de qualidade", {type: "STREAMING", url: "https://www.twitch.tv/cordezera"});
});

client.on("guildDelete", guild =>{
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity("gameplay de qualidade", {type: "STREAMING", url: "https://www.twitch.tv/cordezera"});
});

client.on("message", async message =>{
    
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(!message.content.startsWith(config.prefix)) return;

    if(command === "help"){
        message.channel.send(`comandos: \n ${config.prefix}tanso \n ${config.prefix}ping\n ${config.prefix}clear`);
    }

    if(command === "ping"){
        const m = await message.channel.send("Calculando!");
        m.edit(`Ping: ${m.createdTimestamp - message.createdTimestamp}ms. Ping da API: ${Math.round(client.ws.ping)}ms`);
       }

    if(command === "tanso"){
        if(!args.length) {
            return message.channel.send(`Informe um tanso, ${message.author}!`);
        }
        message.channel.send(`${args[0]} é tanso!`);
    }

    if(command === "clear"){
        if(!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("Você não é tanso suficiente para apagar mensagens!");
            const deleteCount = parseInt(args[0], 10);
            if(!deleteCount || deleteCount < 1 || deleteCount > 100)
                return message.reply("Foi mal, mas só consigo apagar até 100 mensagens!");
            
        const fetched = await message.channel.messages.fetch({ limit: deleteCount + 1});
        message.channel.bulkDelete(fetched)
        message.channel.send(`${args[0]} mensagens apagadas!`).catch(error => console.log(`Erro ao deletar mensagens: ${error}`))
    }

});

client.login(config.token);