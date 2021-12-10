"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.cooldowns = exports.usage = exports.aliases = exports.description = exports.name = void 0;
var prefix = require('../../config.json').prefix;
exports.name = 'help', exports.description = 'List all of my commands or info about a specific command.', exports.aliases = ['commands'], exports.usage = '<command name>', exports.cooldowns = 5;
function execute(message, args) {
    var data = [], commands = message.client.commands; // all commands
    // If getting the general help message, instead of help for a specific command.
    if (!args.length) {
        // Loop through all the commands and add them to the data array.
        data.push('Here\'s a list of all my commands:');
        data.push(commands.map(function (command) { return command.name; }).join(', '));
        data.push("\nYou can send `" + prefix + "help [command name]` to get info on a specific command!");
        // Return the info to the user.
        return message.author.send(data, { split: true })
            .then(function () {
            if (message.channel.type === 'dm')
                return;
            message.reply('I\'ve sent you a DM with all my commands!');
        })
            .catch(function (error) {
            console.error("Could not send help DM to " + message.author.tag + ".\n", error);
            message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
        });
    }
    // If user is asking for help regarding a speciifc command
    var name = args[0].toLowerCase();
    var command = commands.get(name) || commands.find(function (c) { return c.aliases && c.aliases.includes(name); });
    // If not a command then reply with the error.
    if (!command) {
        return message.reply('That\'s not a valid command!');
    }
    // Gather all the data on the specific command and add them to the data array as we return data[] to the user.
    data.push("**Name:** " + command.name);
    if (command.aliases)
        data.push("**Aliases:** " + command.aliases.join(', '));
    if (command.description)
        data.push("**Description:** " + command.description);
    if (command.usage)
        data.push("**Usage:** " + prefix + command.name + " " + command.usage);
    data.push("**Cooldown:** " + (command.cooldown || 3) + " second(s)");
    message.channel.send(data, { split: true });
}
exports.execute = execute;
//# sourceMappingURL=help.js.map