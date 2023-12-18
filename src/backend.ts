// src/index.ts
import express, { Request, Response } from "express";
import {run} from './idealoScraper';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, this is your TypeScript backend!");
});

// Handle POST requests to /submit
app.post("/submit", async (req: Request, res: Response) => {
  const {productType, productWidth, productDepth} = req.body;
  // Process the received data as needed
  console.log("Received data:", {
    productType,
    productWidth,
    productDepth,
  });

  const nameList = await run(
    productType,
    productWidth,
    productDepth,
  );

  res.json(nameList);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
