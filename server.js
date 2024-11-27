const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// Serve static files from public directory
app.use(express.static('public'));
// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Serve game.html for the /game route
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});
// Serve analytics.html for the /analytics route
app.get('/analytics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'analytics.html'));
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 