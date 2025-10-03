# PriceScraperBackend

A TypeScript backend service that scrapes product information from idealo.de using Puppeteer. The service provides a REST API to search for products with specific dimensions and returns product details including names, prices, and links.

## Features

- **Web Scraping**: Automated scraping of product data from idealo.de
- **Product Filtering**: Filter products by type, width, and depth dimensions
- **REST API**: Express.js backend with CORS support
- **TypeScript**: Fully typed codebase for better development experience
- **Cookie Handling**: Automatic cookie consent management

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PriceScraperBackend
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:5000`

### API Endpoints

#### GET `/`
Returns a simple greeting message.

#### POST `/submit`
Submit a product search request with filters.

**Request Body:**
```json
{
  "productType": "string",    // Product type to search for (e.g., "Waschbecken")
  "productWidth": "string",   // Width filter ("50" or "100")
  "productDepth": "string"    // Depth filter ("30" or "60")
}
```

**Response:**
```json
[
  {
    "title": "Product Name",
    "price": 123.45,
    "link": "https://idealo.de/product-link"
  }
]
```

### Example Usage

```bash
curl -X POST http://localhost:5000/submit \
  -H "Content-Type: application/json" \
  -d '{
    "productType": "Waschbecken",
    "productWidth": "50",
    "productDepth": "30"
  }'
```

## Project Structure

```
src/
├── backend.ts      # Express server setup and API endpoints
├── idealoScraper.ts # Main scraping logic using Puppeteer
└── helpScript.ts   # Utility functions for dimension mapping
```

## Dependencies

- **express**: Web framework for Node.js
- **puppeteer**: Headless Chrome automation for web scraping
- **cors**: Cross-Origin Resource Sharing middleware
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution environment

## Development

### TypeScript Configuration
The project uses TypeScript with the following configuration:
- Target: ES6
- Module: CommonJS
- Strict mode enabled
- Source files in `./src`
- Compiled output to `./dist`

### Available Scripts

```bash
npm test          # Run tests (currently not implemented)
npm start         # Start the development server
```

## How It Works

1. **Product Search**: The scraper navigates to idealo.de and searches for the specified product type
2. **Cookie Handling**: Automatically accepts cookie consent to proceed with scraping
3. **Filter Application**: Applies width and depth filters using the site's filter interface
4. **Data Extraction**: Extracts product names, prices, and links from the search results
5. **API Response**: Returns the scraped data as JSON

## Supported Dimensions

### Width Options
- `"50"`: Maps to filter option 1
- `"100"`: Maps to filter option 2

### Depth Options
- `"30"`: Maps to filter option 1
- `"60"`: Maps to filter option 2

## Limitations

- The scraper is designed specifically for idealo.de and may break if the site structure changes
- Currently supports only specific width and depth values
- Runs in non-headless mode by default (browser window will be visible)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `backend.ts` if port 5000 is occupied
2. **Scraping fails**: Check if idealo.de has changed its structure or if there are network issues
3. **TypeScript errors**: Ensure all dependencies are installed and TypeScript is properly configured

### Debug Mode

The scraper runs with `headless: false` by default, which allows you to see the browser automation in action. Set `headless: true` in `idealoScraper.ts` for production use.
