import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';

// Load environment variables from .env file
dotenv.config();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });

// Create Express app
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Use `import.meta.url` to derive the directory name
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// MongoDB connection URI from .env
const mongoDB_URI = process.env.MONGODB_URI;

console.log('MongoDB URI:', process.env.MONGODB_URI);

// MongoDB connection setup
mongoose.connect(mongoDB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1); // Exit the process if the connection fails
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
  const { businessName, description } = req.body;
  const mainImage = req.file?.path; // Get the file path of the uploaded image

  if (!mainImage) {
    return res.status(400).json({ error: 'Main image is required' });
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
