module.exports = {
    apps: [{
        name: 'loveplanet_yala',
        script: './src/bin/www',
        instances: 1,
        exec_mode: 'cluster'
    }]
}