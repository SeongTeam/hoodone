module.exports = {
    apps: [
        {
            name: 'smallQu-FRONT',
            script: 'node_modules/next/dist/bin/next',
            args: 'start --port 4000',
            instances: 1,
            exec_mode: 'cluster',
            wait_ready: true,
            kill_timeout: 5000,
        },
    ],
};
