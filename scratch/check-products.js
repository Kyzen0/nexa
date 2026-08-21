const http = require('http');

http.get('http://localhost:3000/dashboard/products', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Products Page OK:", res.statusCode === 200);
    // Check if the products are rendered by looking for one of them
    const hasProducts = data.includes('Artisan Coffee Blend') && data.includes('Ceramic Pour-Over Dripper');
    console.log("Contains Products:", hasProducts);
  });
});
