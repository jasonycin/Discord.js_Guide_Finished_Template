"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.cooldowns = exports.args = exports.usage = exports.description = exports.name = void 0;
exports.name = 'ping', exports.description = 'Ping command', exports.usage = 'ping', exports.args = false, exports.cooldowns = 5;
function execute(message, args) {
    message.channel.send('Pong2!');
}
exports.execute = execute;
//# sourceMappingURL=ping.js.map