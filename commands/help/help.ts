const { prefix } = require('../../config.json');

export const
    name = 'help',
    description = 'List all of my commands or info about a specific command.',
    aliases = ['commands'],
    usage = '<command name>',
    cooldowns = 5

export function
    execute(message, args) {
        const data = [], // the message returned to the user
              { commands } = message.client // all commands

        // If getting the general help message, instead of help for a specific command.
        if (!args.length)
        {
            // Loop through all the commands and add them to the data array.
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            // Return the info to the user.
            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        // If user is asking for help regarding a speciifc command
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // If not a command then reply with the error.
        if (!command)
        {
            return message.reply('That\'s not a valid command!');
        }

        // Gather all the data on the specific command and add them to the data array as we return data[] to the user.
        data.push(`**Name:** ${command.name}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);


        message.channel.send(data, { split: true });
    }
