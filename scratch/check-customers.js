const http = require('http');

http.get('http://localhost:3000/dashboard/customers', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Response OK:", res.statusCode === 200);
    const hasTotalCustomers = data.includes('Total Customers') || data.includes('Customers');
    console.log("Contains KPIs:", hasTotalCustomers);
  });
});
