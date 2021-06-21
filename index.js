require('dotenv').config({path: __dirname + '/.env'})

// File System
const fs = require('fs');
// Discord Bot (NPM Module)
const Discord = require('discord.js');
// Configuration File
const { prefix, token } = require('./config.json');
// Discord.js Setup
const client = new Discord.Client();
// Event Handlers Setup
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles)
{
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}
// Command Handling Setup
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();


/* Command Handling through "./commands" folder.
 * Each command most be in a sub-folder. DO NOT place files directly under "commands".
 */
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders)
{
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles)
    {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    // Check #1: If no prefix or author is bot then exit.
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Standardize all messages.
    const args = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/);
    const commandName = args
                .shift()
                .toLowerCase();

    // Check #2: If not a command then exit.
    if (!client.commands.has(commandName)) return;

    // Execute Command
    const command = client.commands.get(commandName)
        // alias: ['...', '...']. Use multiple command aliases.
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

        // Check #3: guildOnly: true/false. Disables DM usage.
        if (command.guildOnly && message.channel.type === 'dm')
        {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        // Check #4: permissions: 'PERM'.
        if (command.permissions)
        {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.reply('You can not do this!');
            }
        }

        // Check #4: Check arguments. See "./commands/help/args-info.js".
        if (command.args && !args.length)
        {
            // Standard reply.
            let reply = `You didn't provide any arguments, ${message.author}!`;
            // If usage = <..> <...> is provided then append to reply.
            if (command.usage)
            {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }

        // Check #5: cooldown: number. Prevents spam and too much API usage.
        const { cooldowns } = client;
        if (!cooldowns.has(command.name))
        {
            cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id))
        {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime)
            {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before 
                                     reusing the \`${command.name}\` command.`)
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try
    {
        command.execute(message, args);
    }
    catch (error)
    {
        console.error(error);
        message.reply('There was an error trying to execute that commandName!')
    }
});

client.login(process.env['TOKEN']);