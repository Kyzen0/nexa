const http = require('http');

http.get('http://localhost:3000/dashboard/goals', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Goals Page OK:", res.statusCode === 200);
    const hasGoals = data.includes('Increase Q3 Revenue by 15%') && data.includes('Reduce Customer Churn under 2%');
    console.log("Contains Goals:", hasGoals);
  });
});
