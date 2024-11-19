import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const port = 5001;

// MongoDB URI and Database Name
const uri = 'mongodb://localhost:27017';
const dbName = 'test';  // Target database: 'test'

// Middleware to connect to MongoDB
let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);  // Connect to the 'test' database
    console.log('Connected to MongoDB successfully');
  })
  .catch(error => console.error('MongoDB connection error:', error));

// Route to fetch business by ID
app.get('/businesses/:id', async (req, res) => {
  const businessId = req.params.id;

  // Validate ObjectId format
  if (!ObjectId.isValid(businessId)) {
    return res.status(400).json({ error: 'Invalid ObjectId format' });
  }

  try {
    // Query the 'businesses' collection in the 'test' database
    const business = await db.collection('businesses').findOne({ _id: new ObjectId(businessId) });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Return the found business
    res.json(business);
  } catch (err) {
    console.error('Error while fetching business:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Default route (ensure this stays)
app.get('/', (req, res) => {
  res.send('Hello, this is the Meraki API!');
});

// Your other routes and functionality remain here

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
