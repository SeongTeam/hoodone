module.exports = {
    apps: [
        {
            name: 'Small-Quest',
            cwd: 'build_pr/back',
            script: './dist/main.js',
            instances: 1,
            exec_mode: 'cluster',
            wait_ready: true,
            kill_timeout: 5000,

            env: {
                // 환경 변수
                NODE_ENV: 'server',
            },
        },
    ],
};
