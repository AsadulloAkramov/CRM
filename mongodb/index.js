const mongoose = require('mongoose');
const { MONGODB } = require('../config');

(async () => {
  await mongoose.connect(
    MONGODB.url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 75000,
      family: 4,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    },
    (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Connected to mongodb');
      }
    }
  );
})();
