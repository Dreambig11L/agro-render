const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create a MongoDB model for storing image URLs
const Image = mongoose.model('Image', {
  imageUrl: String,
  owner: String,
  docNum: String,
});

// Middleware to parse JSON in requests
router.use(express.json());

// Endpoint to store image URL
router.post('/kyc', async (req, res) => {
  try {
    const { imageUrl, owner, docNum } = req.body;

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl, owner, docNum });
    await image.save();

    res.status(201).json({ message: 'Image URL stored successfully' });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generic endpoint to handle 'kyc2' and 'kyc3' logic
router.post('/kyc/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const imageUrlKey = `imageUrl${type.slice(-1)}`; // Determines if it's kyc2 or kyc3
    const imageUrl = req.body[imageUrlKey];

    if (!imageUrl) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl });
    await image.save();

    res.status(201).json({ message: `Image URL ${imageUrlKey} stored successfully` });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for fetching images
router.get('/kyc/fetch-images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
