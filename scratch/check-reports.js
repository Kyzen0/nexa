const http = require('http');

http.get('http://localhost:3000/dashboard/reports', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Reports Page OK:", res.statusCode === 200);
    const hasReports = data.includes('Q2 2026 Financial Summary') && data.includes('MB');
    console.log("Contains Reports:", hasReports);
  });
});
