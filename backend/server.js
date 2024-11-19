import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { GridFSBucket } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 5001;

// Manually create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs'); // Set EJS as view engine
app.set('views', path.join(__dirname, 'views')); // Set path to your views folder

// MongoDB Connection
const DB_URI = 'mongodb+srv://merakiadmin:kM8VyIcA2K0bgZay@cluster0.op3vy.mongodb.net/';
let bucket;
mongoose
    .connect(DB_URI)
    .then((connection) => {
        console.log('Connected to MongoDB successfully');
        bucket = new GridFSBucket(connection.connection.db, { bucketName: 'uploads' }); // Initialize GridFS bucket
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// In-memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Mongoose Schema and Model
const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    mainImage: { type: mongoose.Schema.Types.ObjectId }, // Store GridFS file ID
    description: { type: String, required: true },
});
const Business = mongoose.model('Business', businessSchema);

// Handle POST request to create a new business
app.post('/api/businesses', upload.single('mainImage'), async (req, res) => {
    try {
        const { businessName, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Convert file buffer into readable stream
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);

        // Upload to GridFS
        const uploadStream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype,
        });
        readableStream.pipe(uploadStream);

        uploadStream.on('finish', async () => {
            const business = new Business({
                businessName,
                mainImage: uploadStream.id, // Save GridFS file ID
                description,
            });
            await business.save();
            res.status(201).json({ message: 'Business created successfully', business });
        });

        uploadStream.on('error', (error) => {
            console.error('Error uploading file to GridFS:', error);
            res.status(500).json({ error: 'Error uploading file to GridFS' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the business' });
    }
});

// Retrieve a business by ID
app.get('/businesses/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid ObjectId format');
        return res.status(400).render('error', { message: 'Invalid Business ID format', error: null });
    }

    try {
        const business = await Business.findById(id);
        if (!business) {
            console.error('Business not found with the given ID');
            return res.status(404).render('error', { message: 'Business not found', error: null });
        }
        res.render('business', { business });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).render('error', { message: 'Database error occurred', error: err });
    }
});

// Serve images from GridFS
app.get('/images/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid image ID format' });
    }

    try {
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(id));

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('end', () => {
            res.end();
        });

        downloadStream.on('error', (error) => {
            console.error('Error retrieving image from GridFS:', error);
            res.status(404).json({ error: 'Image not found' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the image' });
    }
});

// Fetch all businesses
app.get('/api/businesses', async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching businesses' });
    }
});

// Serve React Frontend
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
