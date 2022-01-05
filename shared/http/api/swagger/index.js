const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const router = require('express').Router();

const config = require('../../../../config/index');

const PORT = config.SERVER_PORT;

const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:{port}',
        description: "Najot Ta'lim CRM local server",
        variables: {
          port: {
            enum: [PORT],
            default: PORT
          }
        }
      }
    ],
    info: {
      version: '1',
      title: "Najot Ta'lim CRM  API",
      description: "Najot Ta'lim CRM API Information"
    }
  },
  apis: [`${__dirname}/components/**/*.yaml`, `${__dirname}/docs/**/*.yaml`]
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = router;
