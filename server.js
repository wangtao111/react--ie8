const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');
const app = express();
const compiler = webpack(config);
app.use(express.static(path.join(__dirname, '/')));
// use in webpack development mode
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/api/decision_result/user_case_info', (req, res) => {
    res.send({
        status: 1
    });
});
const server = app.listen(8555, '192.168.20.60', (err) => {
    if (err) {
        console.log(err);
        return;
    }
    const host = server.address().address;
    const port = server.address().port;
    console.log('应用实例，访问地址为 http://%s:%s', host, port);
});