import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load the Roboto font
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontPathRegular = path.join(__dirname, 'public', 'Roboto-Regular.ttf');
const fontPathBold = path.join(__dirname, 'public', 'Roboto-Bold.ttf');
registerFont(fontPathRegular, { family: 'Roboto' });
registerFont(fontPathBold, { family: 'Roboto', weight: 'bold' });

export async function generateImage(quote, author, outputPath) {
    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Background color
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);

    // Horizontal padding
    const horizontalPadding = 40; 

    // Quote text settings
    context.fillStyle = '#000000';
    context.font = 'bold 50px Roboto';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(quote, width / 2, height / 2 - 30, width - 2 * horizontalPadding); // Adjust horizontal position

    // Author text settings
    context.font = 'italic 40px Roboto';
    context.fillText(`- ${author}`, width / 2, height / 2 + 50, width - 2 * horizontalPadding); // Adjust horizontal position

    // Save the image to the specified path in JPEG format
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 }); // Set JPEG quality (0.8 is a good balance of size and quality)
    fs.writeFileSync(outputPath, buffer);
}
