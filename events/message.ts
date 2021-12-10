export const
    name = 'message'

export function
    execute(message) {
        console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
    }
