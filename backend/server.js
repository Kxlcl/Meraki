import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import ejs from 'ejs';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views folder for templates

// MongoDB Connection
const DB_URI = 'mongodb+srv://merakiadmin:kM8VyIcA2K0bgZay@cluster0.op3vy.mongodb.net/';
mongoose
  .connect(DB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Mongoose Schema and Model
const businessSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  mainImage: { type: String },
  description: { type: String, required: true },
});
const Business = mongoose.model('Business', businessSchema);

// Route to render a page with business data
app.get('/business/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).send('Business not found');
    }
    res.render('businessTemplate', { business });
  } catch (err) {
    res.status(500).send('Error fetching business');
  }
});

// Static File Serving for React (or other static assets)
app.use(express.static(path.join(__dirname, 'build')));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
