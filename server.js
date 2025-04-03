//Install express server
const express = require('express');
const path = require('path');

const app = express();

console.log('Starting server...');

// Serve only the static files form the dist directory
app.use(express.static('./dist/portal'));

app.get('/*', function(req,res) {
    console.log('Request received for path:', req.path);
    res.sendFile(path.join(__dirname,'/dist/portal/index.html'));
});

// Start the app by listening on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Access the application at: http://localhost:${port}`);
});