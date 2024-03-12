const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json({ limit: '2mb' }));
require('dotenv').config();
app.use(
    cors({
        origin: [
            process.env.DEV_SERVER_URL,
            process.env.DEV_BACKEND_URL,
            process.env.PROD_SERVER_1_URL,
            'https://mohsin-riaz.github.io',
            'https://mohsin-riaz.github.io/',
        ],
        allowCredentials: true,
        credentials: true,
        allowedHeaders: [
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Origin',
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'ACCESS-CONTROL-ALLOW-CREDENTIAL',
            'Access-Control-Allow-Headers',
            'Content-Type',
            'Set-Cookie',
            'Cookie',
            'cookie',
            'Authorization',
            'XMLHttpRequest',
            'X-Requested-With',
            'Accept',
        ],
    })
);

app.use('/images', require('./routes/imageRoutes'));

app.listen(3500, () => console.log(`listening on port 3500`));

module.exports = app;
