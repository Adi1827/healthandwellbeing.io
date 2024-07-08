const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define("UserData", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notNull: { msg: "Please enter your name" } },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notNull: { msg: "Please enter unique UserName" } },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Please enter your name" },
      isEmail: { msg: "Please enter valid email " },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password can't be empty" },
      len: { min: 8, msg: "Password must be at least 8 characters" },
    },
  },
});

module.exports = User;
