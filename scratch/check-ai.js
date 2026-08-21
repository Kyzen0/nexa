const http = require('http');

http.get('http://localhost:3000/dashboard/ai-command', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("AI Page OK:", res.statusCode === 200);
    const hasModels = data.includes('Nexa Core') && data.includes('Nexa Fast') && data.includes('Nexa Reasoning') && data.includes('Nexa Lite');
    console.log("Contains Models:", hasModels);
  });
});
