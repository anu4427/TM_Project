const { spawn } = require('child_process');
const path = require('path');

// Start backend server
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend server
const frontend = spawn('npm', ['start'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

// Handle backend errors
backend.on('error', (err) => {
  console.error('Backend error:', err);
  frontend.kill();
  process.exit(1);
});

// Handle frontend errors
frontend.on('error', (err) => {
  console.error('Frontend error:', err);
  backend.kill();
  process.exit(1);
}); 