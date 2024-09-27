"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_js_1 = __importDefault(require("../resources/user/user.routes.js"));
const task_routes_js_1 = __importDefault(require("../resources/task/task.routes.js"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(user_routes_js_1.default);
app.use(task_routes_js_1.default);
const mongoose_1 = require("mongoose");
(0, mongoose_1.connect)(`mongodb+srv://${process.env.MONGODB_AUTHENTICATION}@trullocluster.sf9ye.mongodb.net/NP`);
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
