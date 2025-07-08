const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件：記錄所有請求
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - User-Agent: ${req.headers['user-agent']}`);
  next();
});

// Serve sitemap.xml with correct content type
app.get('/sitemap.xml', (req, res) => {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  
  fs.readFile(sitemapPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading sitemap.xml:', err);
      return res.status(404).send('Sitemap not found');
    }
    
    // 額外的安全檢查：移除任何可能的 script 標籤
    const cleanData = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                         .replace(/<script[^>]*\/>/gi, '');
    
    // 設定安全標頭
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Cache-Control', 'public, max-age=3600');
    res.header('X-Frame-Options', 'DENY');
    
    // 記錄是否有被修改的內容
    if (cleanData !== data) {
      console.warn('⚠️ 警告：檢測到並移除了可疑的 script 標籤');
      console.warn('原始長度:', data.length, '清理後長度:', cleanData.length);
    }
    
    res.send(cleanData);
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
  console.log('🛡️ 安全防護已啟用：自動移除可疑 script 標籤');
});