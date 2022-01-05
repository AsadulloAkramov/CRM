const express = require('express');
const { ApolloServer, ApolloError } = require('apollo-server-express');
const http = require('http');
const cors = require('cors');
const Sentry = require('@sentry/node');
const fileUpload = require('express-fileupload');
const { SERVER_PORT } = require('./config');
const modules = require('./modules/modules');
const jwt = require('./utils/jwt');
const httpModule = require('./shared/http/api/routes');
require('./mongodb');

const expressServer = express();

expressServer.use(express.json());
expressServer.use(fileUpload());
expressServer.use(cors());
expressServer.use(httpModule.router);

expressServer.get('/check-token', ({ query: { token } }, res) => {
  try {
    jwt.verify(token);
    res.status(200).json({ status: 200 }).end();
  } catch (error) {
    res.status(401).json({ status: 401, error }).end();
  }
});

const apolloServer = new ApolloServer({
  modules,
  context: ({ req }) => ({ token: req?.headers?.token }),
  plugins: [
    {
      // eslint-disable-next-line no-unused-vars
      requestDidStart(_) {
        return {
          didEncounterErrors(ctx) {
            if (!ctx.operation) {
              return;
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const err of ctx.errors) {
              if (err instanceof ApolloError) {
                // eslint-disable-next-line no-continue
                continue;
              }

              Sentry.withScope((scope) => {
                scope.setTag('kind', ctx.operation.operation);

                scope.setExtra('query', ctx.request.query);
                scope.setExtra('variables', ctx.request.variables);

                if (err.path) {
                  scope.addBreadcrumb({
                    category: 'query-path',
                    message: err.path.join(' > '),
                    level: Sentry.Severity.Debug
                  });
                }
                const transactionId = ctx.request.http.headers.get('x-transaction-id');
                if (transactionId) {
                  scope.setTransaction(transactionId);
                }
                console.log(err);
                Sentry.captureException(err);
              });
            }
          },
          willSendResponse(ctx) {
            if (ctx.response && ctx.response.errors) {
              const customError = {
                message: ctx.response.errors[0].extensions.exception.error,
                code: ctx.response.errors[0].extensions.exception.code
              };
              ctx.response.errors = customError;
            }
            return ctx;
          }
        };
      }
    }
  ]
});

apolloServer.applyMiddleware({ app: expressServer });

const httpServer = http.createServer(expressServer);
require('./modules/notification/index')(httpServer);

apolloServer.installSubscriptionHandlers(httpServer);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true })
  ]
});

httpServer.listen(
  SERVER_PORT,
  console.log(`Server ready at http://localhost:${SERVER_PORT}/graphql`)
);
