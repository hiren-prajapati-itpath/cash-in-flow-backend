import { projectStatus } from '../../shared/constants/constant.js';

export default (sequelize, Sequelize) => {
  const projects = sequelize.define('projects', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.ENUM('milestones'), allowNull: false },
    status: { type: Sequelize.ENUM(...Object.values(projectStatus)) },
    description: { type: Sequelize.TEXT, allowNull: false },
  });

  projects.associate = (models) => {
    projects.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
    projects.hasMany(models.milestones, {
      foreignKey: 'projectId',
    });
    projects.hasMany(models.projectDocuments, {
      foreignKey: 'projectId',
    });
    projects.hasMany(models.disputes, {
      foreignKey: 'projectId',
    });
  };

  return projects;
};
