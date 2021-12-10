export const
    name = 'ping',
    description = 'Ping command',
    usage = 'ping',
    args = false,
    cooldowns = 5

export function
    execute(message, args) {
        message.channel.send('Pong2!');
    }
