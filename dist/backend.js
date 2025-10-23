"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const idealoScraper_1 = require("./idealoScraper");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Hello, this is your TypeScript backend!");
});
// Handle POST requests to /submit
app.post("/submit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productType, productWidth, productDepth } = req.body;
    // Process the received data as needed
    console.log("Received data:", {
        productType,
        productWidth,
        productDepth,
    });
    const nameList = yield (0, idealoScraper_1.run)(productType, productWidth, productDepth);
    res.json(nameList);
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
