export const
    name = 'args',
    description = 'Shows the arguments of a command.',
    args = true,
    usage = '<argument>'

export function
    execute(message, args) {
        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    }
