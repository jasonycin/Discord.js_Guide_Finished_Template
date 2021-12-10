"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.usage = exports.args = exports.description = exports.name = void 0;
exports.name = 'args', exports.description = 'Shows the arguments of a command.', exports.args = true, exports.usage = '<argument>';
function execute(message, args) {
    message.channel.send("Arguments: " + args + "\nArguments length: " + args.length);
}
exports.execute = execute;
//# sourceMappingURL=args.js.map