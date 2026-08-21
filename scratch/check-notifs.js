const http = require('http');

http.get('http://localhost:3000/dashboard/notifications', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("Notifications Page OK:", res.statusCode === 200);
    const hasNotifs = data.includes('Inventory Alert: Artisan Coffee Blend is running low');
    console.log("Contains Notifications:", hasNotifs);
    const hasUnread = data.includes('3 Unread'); // Or whatever the count is, there are 3 unread seeded in DB!
    console.log("Contains Unread Badge:", hasUnread);
  });
});
