module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldowns: 5,
    execute(message, args)
    {
        message.channel.send('Pong.');
    }
}