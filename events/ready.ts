export const
    name = 'ready',
    once = true

export function
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
