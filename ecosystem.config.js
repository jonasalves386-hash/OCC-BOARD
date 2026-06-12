module.exports = {
  apps: [
    {
      name: 'occ-board',
      script: 'server.js',
      cwd: '/var/www/occ-board/backend',
      env: {
        PORT: 3000,
        TIMEZONE: 'America/New_York',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
