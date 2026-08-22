const http = require('http');

http.get('http://localhost:3000/login', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Login Page OK:", res.statusCode === 200);
    const hasLogin = data.includes('Welcome back') && data.includes('Sign In');
    console.log("Contains Login UI:", hasLogin);
  });
});

http.get('http://localhost:3000/dashboard', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // If not logged in, we expect a 307 Temporary Redirect to /login
    console.log("Dashboard Redirects (307):", res.statusCode === 307 || res.statusCode === 308);
    console.log("Dashboard Location:", res.headers.location);
  });
});
