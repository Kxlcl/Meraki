import express from 'express';
import path from 'path';

const app = express();

// Middleware for static files (if you want to serve HTML, CSS, JS files)
const __dirname = path.resolve(); // Since ES modules don't have __dirname
app.use(express.static(path.join(__dirname, 'public')));

// Both / and /home should return the same content
app.get(['/', '/home'], (req, res) => {
  res.send('Welcome to the Home page!');
});

// Example route for About page
app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

// Catch-all route for other paths (returns 404 for undefined routes)
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(5001, () => {
  console.log('Server running on http://localhost:5001');
});
