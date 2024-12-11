export default (sequelize, Sequelize) => {
  const projectDocuments = sequelize.define('projectDocuments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    fileUrl: { type: Sequelize.STRING, allowNull: false },
  });

  projectDocuments.associate = (models) => {
    projectDocuments.belongsTo(models.projects, {
      foreignKey: 'projectId',
    });
  };

  return projectDocuments;
};
