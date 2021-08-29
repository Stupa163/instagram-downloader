module.exports = {
    entry: {
        app: './dist/script.js',
        background: './dist/background.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build',
    },
    mode: "production"
};
