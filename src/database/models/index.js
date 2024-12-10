import Sequelize from 'sequelize';
import { _db } from '../../config/config.js';
import usersModel from './users.model.js'; // Directly import your models
import logger from '../../config/logger.js';

const db = {};

const dbConnection = new Sequelize(_db.database, _db.user, _db.password, { ..._db });

// Authenticate the database connection
dbConnection
  .authenticate()
  .then(() => {
    logger.info('✅ Postgres connection has been established successfully.');
  })
  .catch((err) => {
    logger.error('Sequelize connection error:', err);
  });

db.Sequelize = Sequelize;
db.dbConnection = dbConnection;

const syncDB = async () => {
  try {
    await dbConnection.sync({ alter: true, force: false });
    logger.info('🔁 Database Synchronized.');
  } catch (err) {
    logger.error('Failed to sync db:', err.message);
  }
};

db.syncDB = syncDB;

db.Users = usersModel(dbConnection, Sequelize);

Object.keys(dbConnection.models).forEach((modelName) => {
  if (dbConnection.models[modelName].associate) {
    dbConnection.models[modelName].associate(dbConnection.models);
  }
});

export default db;
