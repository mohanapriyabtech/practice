const express = require("express")
const app = express()
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');


app.get('/convert', async (req, res) => {
    const htmlFilePath = path.join(__dirname, 'file.html');
    const imageFilePath = path.join(__dirname, 'image.png');

    try {
        const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.screenshot({path: imageFilePath});

        await browser.close();

        console.log('Conversion successful. Image saved to:', imageFilePath);
        res.send('Conversion successful. Image saved.');
    } catch (error) {
        console.error('Error converting HTML to image:', error);
        res.status(500).send('Error converting HTML to image');
    }
});


async function splitDocument(htmlFilePath, outputFolderPath) { // Launch a headless browser instance
    const browser = await puppeteer.launch();

    try { // Open a new page
        const page = await browser.newPage();

        // Navigate to the HTML file
        await page.goto(`file://${htmlFilePath}`);

        // Get the total number of pages in the document
        const totalPages = await page.$$eval('.page', (pages) => pages.length);

        // Iterate over each page and capture a screenshot
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) { // Navigate to the desired page
            await page.goto(`file://${htmlFilePath}#page=${
                pageIndex + 1
            }`);

            // Capture a screenshot of the page
            const screenshotPath = `${outputFolderPath}/page_${
                pageIndex + 1
            }.jpg`;
            await page.screenshot({path: screenshotPath, type: 'jpeg', fullPage: true});

            console.log(`Page ${
                pageIndex + 1
            } saved to ${screenshotPath}`);
        }
    } catch (error) {
        console.error('Error in splitting the document:', error);
    } finally { // Close the browser
        await browser.close();
    }
}

app.get('/convert-html-to-image', async (req, res) => {
    const htmlFilePath = 'path/to/input.html';
    const outputFolderPath = 'path/to/output/folder';

    splitDocument(htmlFilePath, outputFolderPath);
})
app.get("/", (req, res) => res.send("Hello World!"))
app.listen(5000, () => console.log("Server ready"))
