module.exports = {
    apps : [{
        name: 'jb-test-backend',

        script: 'dist/src/index.js',
        interpreter: 'node',

        instances: 1,
        exec_mode: 'fork',
        autorestart: true,
        exp_backoff_restart_delay: 1000,
        watch: false,
        max_memory_restart: '4G',

        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
};
