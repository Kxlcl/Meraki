import express from 'express';
import mongoose from 'mongoose';
import Business from './models/businessbackend.js'; // Adjust the path to where your Business model is defined

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/meraki', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

// Handle Get request for business by ID
app.get('/businesses/:id', async (req, res) => {
  const { id } = req.params; // Get the ObjectId from the URL parameter
  console.log('Received ID:', id); // Log the ID for debugging

  // Validate ObjectId format using mongoose's ObjectId.isValid method
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ObjectId format' });
  }

  try {
    // Convert the string to ObjectId if it's valid
    const objectId = mongoose.Types.ObjectId(id);

    // Find the business by ID
    const business = await Business.findById(objectId);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Return the business data in JSON format
    return res.status(200).json(business);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Handle other requests and general routes (as needed)
app.get('/', (req, res) => {
  res.send('Welcome to the Meraki API');
});

// Example: A route for creating a business (for testing purposes)
app.post('/businesses', async (req, res) => {
  try {
    const business = new Business({
      businessName: 'Example Business',
      mainImage: 'uploads/example.jpg',
      description: 'This is an example business',
    });
    await business.save();
    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ error: 'Error saving the business' });
  }
});

// Start the server
const port = 5001;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
