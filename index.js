"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dotenv contains the token for the bot login
require('dotenv').config({ path: __dirname + '/.env' });
// File System
var fs = require("fs");
// Discord Bot (NPM Module)
var Discord = require('discord.js');
var client = new Discord.Client();
// Configuration File
var prefix = require('./config.json').prefix;
/**
 * We want to dynamically load all events in the ./events/ folder.
 * All events are module exports, so we need to go through each folder and define them.
 */
var eventFiles = fs.readdirSync('./events').filter(function (file) { return file.endsWith('.js'); });
var _loop_1 = function (file) {
    // Requiring the event file loads the module into our variable.
    var event_1 = require("./events/" + file);
    // Some events are consistently emitted or only emitted once. This deals with that.
    switch (event_1.once) {
        case true:
            client.once(event_1.name, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return event_1.execute.apply(event_1, __spreadArray(__spreadArray([], args), [client]));
            });
            break;
        default:
            client.on(event_1.name, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return event_1.execute.apply(event_1, __spreadArray(__spreadArray([], args), [client]));
            });
            break;
    }
};
for (var _i = 0, eventFiles_1 = eventFiles; _i < eventFiles_1.length; _i++) {
    var file = eventFiles_1[_i];
    _loop_1(file);
}
/**
 * We also need to dynamically load all commands in the ./commands/ folder.
 * All commands are module exports, so we need to iterate through each one, deal with them, and then load them into the Discord client.
 */
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
// Commands can be in sub-folders. We need to go through each sub-folder in ./commands AND the files in them.
var commandFolders = fs.readdirSync('./commands');
// Iterate through each sub-folder
for (var _a = 0, commandFolders_1 = commandFolders; _a < commandFolders_1.length; _a++) {
    var folder = commandFolders_1[_a];
    // Extract all .js files
    var commandFiles = fs.readdirSync("./commands/" + folder).filter(function (file) { return file.endsWith('.js'); });
    // Iterate through our .js files and load them into our commands collection.
    for (var _b = 0, commandFiles_1 = commandFiles; _b < commandFiles_1.length; _b++) {
        var file = commandFiles_1[_b];
        var command = require("./commands/" + folder + "/" + file);
        client.commands.set(command.name, command);
    }
}
/**
 * Event emitters (come from ./events)
 */
// We want confirmation in the terminal that everything was successful when starting the bot.
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
/**
 * This is the core of dealing with all incoming messages on a server.
 * We will need to guard against any messages that we do not want to deal with.
 */
client.on('message', function (message) {
    // Guard clause: only allow messages with proper prefix and not from the bot itself.
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    // Standardize the inputted message
    var args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/);
    var commandName = args.shift().toLowerCase();
    // Guard clause: only allow commands that are in our commands collection.
    if (!client.commands.has(commandName))
        return;
    // Now that all checks are passed, we need to execute the command
    var command = client.commands.get(commandName)
        // Find aliases: ['...', '...'].
        || client.commands.find(function (cmd) { return cmd.aliases && cmd.aliases.includes(commandName); });
    // Guard clause: if we cannot find the command, return.
    if (!command)
        return;
    /**
     * The following options are possible on the exported commands:
     * - guildOnly: true/false
     * - permissions: 'string'
     * - args: true/false
     */
    // 1. Guard clause based on the status of guildOnly.
    if (command.guildOnly && message.channel.type === "dm")
        return message.reply('I can\'t execute that command inside DMs!');
    // 2. Guard clause based on the status of perm.
    if (command.permissions) {
        var authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You can not do this!');
        }
    }
    // 3. Guard clause based on the status of args. We need to check if the command requires args (true).
    if (command.args && !args.length) {
        var reply = "You didn't provide any arguments, " + message.author + "!";
        // If we defined the usage of arguments, we can add that to the reply.
        if (command.usage)
            reply += "\nThe proper usage would be: `" + prefix + command.name + " " + command.usage + "`";
        return message.channel.send(reply);
    }
    /**
     * Cool down timer to prevent spam
     */
    var cooldowns = client.cooldowns;
    // If the cooldown is not set yet, set it!
    if (!cooldowns.has(command.name))
        cooldowns.set(command.name, new Discord.Collection());
    // Calculate the cooldown time.
    var now = Date.now();
    var timestamps = cooldowns.get(command.name);
    var cooldownAmount = (command.cooldown || 3) * 1000;
    // We need to figure weather the cooldown is to kick in, and if so inform the user about it.
    if (timestamps.has(message.author.id)) {
        var expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            var timeLeft = (expirationTime - now) / 1000;
            return message.reply("Please wait " + timeLeft.toFixed(1) + " more second(s) before reusing the `" + command.name + "` command.");
        }
    }
    // We need to set the timestamp and ensure to remove it after our cooldown is over.
    timestamps.set(message.author.id, now);
    setTimeout(function () { return timestamps.delete(message.author.id); }, cooldownAmount);
    // Actually execute the command.
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that commandName!');
    }
});
// Lastly, let's start!
client.login(process.env['TOKEN']);
//# sourceMappingURL=index.js.map