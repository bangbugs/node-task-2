const express = require('express'),
    winston = require('winston'),
    expressWinston = require('express-winston'),
    mongoose = require('mongoose'),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('../swagger.json');
    
require('dotenv').config();

const resourceRoutes = require('../routes');

const app = express();
app.use(express.json())

// winston config
app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
  }));

app.get('/api/v1/healthz', (req, res) => {
    res.status(200).json({
        message: "healthy"
    });
});

app.use('/api/v1/resource', resourceRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.info(`DB Connected`)
});

mongoose.connection.on('error', err => {
    console.error(`DB connection error: ${err.message}`)
});

module.exports = {
    app,
}