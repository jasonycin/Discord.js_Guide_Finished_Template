module.exports = {
    name: 'args-info',
    description: 'Information about the arguments provided.',
    args: true,
    usage: '<argument>',
    execute(message, args)
    {
        // Information Returned
        message.channel.send(`Arguments: ${args}\n
                             Arguments length: ${args.length}`);
    }
}