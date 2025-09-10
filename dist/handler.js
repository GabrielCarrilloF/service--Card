"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = hello;
const uuid_1 = require("uuid");
async function hello() {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hola desde card-service 🚀",
            requestId: (0, uuid_1.v4)(),
        }),
    };
}
if (require.main === module) {
    hello().then((res) => console.log(res));
}
