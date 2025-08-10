import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

const baseUrl = 'https://example.com'; // Replace with the actual URL
const outputDir = 'cloned-website';

async function fetchAndSave(url: string, outputPath: string) {
  try {
    const response = await axios.get(url);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, response.data);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
  }
}

async function cloneWebsite() {
  try {
    // Fetch the main HTML page
    const response = await axios.get(baseUrl);
    const $ = cheerio.load(response.data);

    // Create the output directory
    fs.mkdirSync(outputDir, { recursive: true });

    // Save the main HTML page
    const htmlPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(htmlPath, response.data);

    // Fetch and save CSS and JS files
    $('link[rel="stylesheet"], script').each((_, element) => {
      const src = $(element).attr('href') || $(element).attr('src');
      if (src) {
        const url = new URL(src, baseUrl).href;
        const outputPath = path.join(outputDir, url.replace(baseUrl, ''));
        fetchAndSave(url, outputPath);
      }
    });

    console.log('Website cloned successfully!');
  } catch (error) {
    console.error('Error cloning website:', error);
  }
}

cloneWebsite();