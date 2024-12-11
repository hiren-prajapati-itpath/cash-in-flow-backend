import Sequelize from 'sequelize';
import { _db } from '../../config/config.js';
import users from './users.model.js'; // Directly import your models
import projects from './projects.model.js';
import projectDocuments from './projectDocuments.model.js';
import milestones from './milestones.model.js';
import disputes from './disputes.model.js';

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
    logger.error('Failed to sync db:', err);
  }
};

db.syncDB = syncDB;

db.Users = users(dbConnection, Sequelize);
db.projects = projects(dbConnection, Sequelize);
db.projectsDocuments = projectDocuments(dbConnection, Sequelize);
db.milestones = milestones(dbConnection, Sequelize);
db.disputes = disputes(dbConnection, Sequelize);

// Set up associations after all models are initialized
Object.keys(dbConnection).forEach((modelName) => {
  if (dbConnection[modelName].associate) {
    dbConnection[modelName].associate(dbConnection);
  }
});

export default db;
