const http = require('http');

http.get('http://localhost:3000/dashboard/analytics', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Analytics Page OK:", res.statusCode === 200);
    const hasChannels = data.includes('Shopify (Online Store)') && data.includes('Amazon Marketplace');
    console.log("Contains Channels:", hasChannels);
    const hasTotalGMV = data.includes('Total Gross Merchandise Value');
    console.log("Contains Total GMV:", hasTotalGMV);
  });
});
