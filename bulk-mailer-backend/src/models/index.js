import { sequelize } from "../config/db.js";
import User from "./User.js";
import EmailBatch from "./EmailBatch.js";
import EmailQueue from "./EmailQueue.js";

// relations
User.hasMany(EmailBatch);
EmailBatch.belongsTo(User);

EmailBatch.hasMany(EmailQueue);
EmailQueue.belongsTo(EmailBatch);

export {
  sequelize,
  User,
  EmailBatch,
  EmailQueue
};