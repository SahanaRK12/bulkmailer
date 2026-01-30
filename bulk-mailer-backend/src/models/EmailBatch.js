import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const EmailBatch = sequelize.define("EmailBatch", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default EmailBatch;