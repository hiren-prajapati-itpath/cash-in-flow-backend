import { milestoneStatus } from '../../shared/constants/constant.js';

export default (sequelize, Sequelize) => {
  const milestones = sequelize.define('milestones', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: { type: Sequelize.STRING, allowNull: false },
    dueDate: { type: Sequelize.DATE, allowNull: true },
    status: { type: Sequelize.ENUM(...Object.values(milestoneStatus)) },
    paymentAmount: { type: Sequelize.FLOAT, allowNull: false },
    currency: { type: Sequelize.ENUM('USD', 'EUR', 'GBP'), allowNull: false, defaultValue: 'GBP' },
  });

  milestones.associate = (models) => {
    milestones.belongsTo(models.projects, {
      foreignKey: 'projectId',
    });
  };

  return milestones;
};
