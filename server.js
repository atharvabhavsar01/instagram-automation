import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetchQuote from './fetchQuote.js';
import { generateImage } from './imageService.js';
import axios from 'axios'; 
import cron from 'node-cron';
import dotenv from 'dotenv';

// Necessary for __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config();
const PORT = process.env.PORT || 4500; 



// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.send("ok");
});

cron.schedule('41 23 * * *', async () => {
    try {
        const quoteData = await fetchQuote();
        const imagePath = path.join(__dirname, 'public', 'quote.jpeg');
        console.debug("before image generation")
        await generateImage(quoteData.q, quoteData.a, imagePath);
        console.debug("image generated")
        
        // Upload the generated image to Instagram using Axios
        const apiEndpoint = 'https://graph.facebook.com/v20.0/17841467397655360/media';
        const accessToken = process.env.ACCESS_TOKEN; 
        const ngrokUrl = process.env.NGROK_URL;
        const imageUrl = `${ngrokUrl}/quote.jpeg`;
        
        // Step 1: Create media container
        const createMediaResponse = await axios.post(apiEndpoint, {
            access_token: accessToken,
            image_url: imageUrl,
            caption: `${quoteData.q} - ${quoteData.a}`
        });
        
        const creationId = createMediaResponse.data.id;
        console.log("Container created with ID:", creationId);

        // Step 2: Publish media container
        const publishEndpoint = `https://graph.facebook.com/v20.0/17841467397655360/media_publish?creation_id=${creationId}`;
        const publishResponse = await axios.post(publishEndpoint, { access_token: accessToken });
        
        console.log('Image uploaded successfully to Instagram');
    } catch (error) {
        console.error('Error generating or uploading image:', error);
         
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
