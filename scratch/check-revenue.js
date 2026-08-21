const http = require('http');

http.get('http://localhost:3000/dashboard', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const match = data.match(/Total Revenue.*?\$(\d{1,3}(,\d{3})*(\.\d{2})?)/i) || data.match(/\$1,249\.80/);
    if (match) console.log('Found revenue:', match[0]);
    else console.log('Revenue string not found. Snippet:', data.substring(0, 500));
  });
});
