const fs = require('fs');
const path = require('path');

// Ensure the .env file exists
const envContent = `VITE_API_URL=/.netlify/functions
NODE_ENV=production`;

try {
  // Create scripts directory if it doesn't exist
  if (!fs.existsSync(path.join(process.cwd(), 'scripts'))) {
    fs.mkdirSync(path.join(process.cwd(), 'scripts'));
  }

  // Write the .env file
  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent);
  console.log('Environment file created successfully');
} catch (error) {
  console.error('Error creating environment file:', error);
  process.exit(1);
}
