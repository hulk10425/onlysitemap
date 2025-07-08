const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve sitemap.xml with correct content type
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  
  fs.readFile(sitemapPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading sitemap.xml:', err);
      return res.status(404).send('Sitemap not found');
    }
    
    res.header('Content-Type', 'application/xml');
    res.send(data);
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Sitemap server is running. Access <a href="/sitemap.xml">sitemap.xml</a>');
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Sitemap available at: http://localhost:${PORT}/sitemap.xml`);
});