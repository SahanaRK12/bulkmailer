import cron from "node-cron";
import { EmailQueue } from "../models/index.js";
import { transporter } from "./mailer.js";

cron.schedule("*/1 * * * *", async () => {
  const emails = await EmailQueue.findAll({
    where: { status: "PENDING" },
    limit: 5
  });

  for (const mail of emails) {
    try {
      await transporter.sendMail({
        to: mail.email,
        subject: "Bulk Mail",
        text: mail.message
      });

      mail.status = "SENT";
      await mail.save();
    } catch {
      mail.status = "FAILED";
      await mail.save();
    }
  }
});
