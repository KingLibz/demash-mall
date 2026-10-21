/**
 * DEMASH GLOBAL AUTONOMOUS CORE ENGINE
 * Production PM2 Ecosystem Cluster Deployment Configuration
 * Directory Track: /home/ubuntu/demash-engine-root/
 * Multi-threaded Node.js / TypeScript App Clusters
 */

module.exports = {
  apps: [
    {
      name: 'demash-global-core',
      script: 'server.ts',
      interpreter: 'node_modules/.bin/tsx',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/demash-error.log',
      out_file: './logs/demash-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      listen_timeout: 10000,
      restart_delay: 2000
    },
    {
      name: 'demash-domestic-outsourcer',
      script: 'domesticSubcontractor.ts',
      interpreter: 'node_modules/.bin/tsx',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/outsourcer-error.log',
      out_file: './logs/outsourcer-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
