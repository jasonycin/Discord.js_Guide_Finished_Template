"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.once = exports.name = void 0;
exports.name = 'ready', exports.once = true;
function execute(client) {
    console.log("Ready! Logged in as " + client.user.tag);
}
exports.execute = execute;
//# sourceMappingURL=ready.js.map