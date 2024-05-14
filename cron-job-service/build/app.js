"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000; // Use environment variables
// Define a simple route for the root path ('/')
app.get('/', (req, res) => {
    res.send('Hello from my Express TypeScript (ES Modules) app!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
