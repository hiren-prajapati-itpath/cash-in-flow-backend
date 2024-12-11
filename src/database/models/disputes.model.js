import { disputeStatus } from '../../shared/constants/constant.js';

export default (sequelize, Sequelize) => {
  const disputes = sequelize.define('disputes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: { type: Sequelize.STRING, allowNull: false },
    type: {
      type: Sequelize.ENUM(...Object.values(disputeStatus)),
      allowNull: false,
    },
    description: { type: Sequelize.TEXT, allowNull: false },
    status: {
      type: Sequelize.ENUM(...Object.values(disputeStatus)),
      allowNull: false,
      defaultValue: 'starting',
    },
    raisedBy: { type: Sequelize.INTEGER, allowNull: false },
    fileUrls: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: true },
  });

  return disputes;
};
