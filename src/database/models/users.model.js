import { hashPassword, comparePassword } from '../../services/bcrypt.service.js';
import { Paginate } from '../plugins/index.js';
import { systemRoles } from '../../shared/constants/constant.js';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM(...Object.values(systemRoles)),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeZone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    personalAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastLogin: { type: DataTypes.DATE },
  });

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
