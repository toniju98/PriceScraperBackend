// src/backend.ts
import express, { Request, Response } from "express";
import { run } from './idealoScraper';
import cors from 'cors';

// Types
interface ProductRequest {
  productType: string;
  productWidth: string;
  productDepth: string;
}

interface Product {
  title: string | null;
  price: number;
  link: string | null;
}

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "PriceScraperBackend API",
    status: "running",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Main scraping endpoint
app.post("/submit", async (req: Request, res: Response) => {
  try {
    const { productType, productWidth, productDepth }: ProductRequest = req.body;

    // Validate required fields
    if (!productType || !productWidth || !productDepth) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["productType", "productWidth", "productDepth"]
      });
    }

    // Validate dimension values
    const validWidths = ["50", "100"];
    const validDepths = ["30", "60"];
    
    if (!validWidths.includes(productWidth)) {
      return res.status(400).json({
        error: "Invalid productWidth",
        validValues: validWidths
      });
    }
    
    if (!validDepths.includes(productDepth)) {
      return res.status(400).json({
        error: "Invalid productDepth", 
        validValues: validDepths
      });
    }

    console.log("Processing request:", { productType, productWidth, productDepth });

    // Set timeout for scraping operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Scraping timeout')), 60000); // 60 seconds
    });

    const scrapingPromise = run(productType, productWidth, productDepth);
    
    const products = await Promise.race([scrapingPromise, timeoutPromise]) as Product[];

    console.log(`Scraping completed. Found ${products.length} products`);
    
    res.json({
      success: true,
      count: products.length,
      products: products
    });

  } catch (error) {
    console.error("Scraping error:", error);
    
    const statusCode = error instanceof Error && error.message === 'Scraping timeout' ? 408 : 500;
    
    res.status(statusCode).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: any) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
