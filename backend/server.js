import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Use `import.meta.url` to derive the directory name
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Enable CORS
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Store in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });

// MongoDB connection URI from .env
const mongoDB_URI = process.env.MONGODB_URI;

console.log('MongoDB URI:', mongoDB_URI);

// MongoDB connection setup
mongoose.connect(mongoDB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });

// Define a schema for the business form submission
const BusinessFormSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  mainImage: { type: String, required: true }, // Store file path or URL
  description: { type: String, required: true },
}, { timestamps: true });

const BusinessForm = mongoose.model('BusinessForm', BusinessFormSchema);

// API route for form submission with file upload
app.post('/api/businesses', upload.single('mainImage'), async (req, res) => {
  console.log('Request Body:', req.body); // Log the form data
  console.log('Uploaded File:', req.file); // Log the file details

  const { businessName, description } = req.body;
  const mainImage = req.file?.path; // Get the file path of the uploaded image

  // Ensure the file is present
  if (!mainImage) {
    return res.status(400).json({ error: 'Main image is required' });
  }

  // Ensure business name and description are provided
  if (!businessName || !description) {
    return res.status(400).json({ error: 'Business name and description are required' });
  }

  // Create a new document in the database
  const newBusiness = new BusinessForm({
    businessName,
    mainImage,
    description,
  });

  try {
    await newBusiness.save();
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ error: 'Error submitting the form' });
  }
});

// Serve React app (catch-all for routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Set the server to listen on the specified port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
