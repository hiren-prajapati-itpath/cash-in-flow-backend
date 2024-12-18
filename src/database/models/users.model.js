import { hashPassword, comparePassword } from '../../services/bcrypt.service.js';
import { Paginate } from '../plugins/index.js';
import { systemRoles } from '../../shared/constants/constant.js';

export default (sequelize, Sequelize) => {
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    role: {
      type: Sequelize.ENUM(...Object.values(systemRoles)),
      allowNull: true,
      defaultValue: systemRoles.superAdmin,
    },
    referralSource: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otpExpiration: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    isVerified: {
      type: Sequelize.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
    passwordResetKey: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    timeZone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    taxId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    personalAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    postalAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    profileImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastLogin: { type: Sequelize.DATE, allowNull: true },
  });

  Users.associate = (models) => {
    Users.hasMany(models.projects, {
      foreignKey: 'userId',
    });
    Users.hasMany(models.disputes, {
      foreignKey: 'raisedBy',
    });
  };

  // Hash password before creating a new user
  Users.beforeCreate(async (user) => {
    if (user.password) {
      const hashedPassword = await hashPassword(user.password);
      user.setDataValue('password', hashedPassword);
    }
  });

  // Instance method for password comparison
  Users.prototype.isPasswordMatch = async function (password) {
    const isMatch = await comparePassword(password, this.password);
    return isMatch;
  };

  // Apply the paginate plugin
  Paginate(Users);

  return Users;
};
