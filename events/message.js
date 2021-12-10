"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.name = void 0;
exports.name = 'message';
function execute(message) {
    console.log(message.author.tag + " in #" + message.channel.name + " sent: " + message.content);
}
exports.execute = execute;
//# sourceMappingURL=message.js.map