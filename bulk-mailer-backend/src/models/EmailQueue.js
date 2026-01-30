import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const EmailQueue = sequelize.define("EmailQueue", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  }, // ✅ COMMA ADDED HERE
  message: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING" // SENT | FAILED
  }
});

export default EmailQueue;