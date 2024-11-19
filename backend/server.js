import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build folder
const buildPath = path.join(__dirname, '../build'); // Adjust path if needed
app.use(express.static(buildPath));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
