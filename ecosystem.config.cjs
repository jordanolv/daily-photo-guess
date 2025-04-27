module.exports = {
  apps: [
    {
      name: 'daily-photo-api',
      cwd: './api',
      script: 'dist/src/main.js',
      env: {
        PORT: 6049,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'daily-photo-ui',
      cwd: './ui',
      script: 'node_modules/vite/bin/vite.js',
      args: 'preview --port 6050 --host',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}; 