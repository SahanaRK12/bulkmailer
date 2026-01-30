import { EmailQueue } from "../models/index.js";
import { transporter } from "../utils/mailer.js";
import { EmailSettings } from "../models/index.js";

const settings = await EmailSettings.findByPk(1);
if (settings?.is_paused) {
console.log("⏸ Email sending is paused");
return;
}

const BATCH_SIZE = 10;   // emails per batch
const DELAY = 3000;     // 3 seconds

const processEmails = async () => {
const emails = await EmailQueue.findAll({
where: { status: "PENDING" },
limit: BATCH_SIZE
});

// for (const mail of emails) {
// const finalMessage =
//     mail.message?.replace(/{{name}}/gi, mail.name || "") ||
//     `Hello ${mail.name}`;

// try {
//     console.log("📨 Sending:", mail.email);

//     // lock email
//     mail.status = "PROCESSING";
//     await mail.save();

//     await transporter.sendMail({
//     from: `"Bulk Mailer" <${process.env.MAIL_USER}>`,
//     to: mail.email,
//     subject: "Bulk Email",
//     text: finalMessage
//     });

//     mail.status = "SENT";
//     mail.message = finalMessage;
//     await mail.save();
// } catch (err) {
//     console.error("❌ Failed:", mail.email, err.message);

//     mail.status = "FAILED";
//     await mail.save();
// }
// }

for (const mail of emails) {
    const settings = await EmailSettings.findByPk(1);
    if (settings?.is_paused) {
        console.log("⏸ Email sending paused mid-batch");
        break; // stop sending immediately
    }

    const finalMessage = mail.message.replace(/{{name}}/gi, mail.name || "");

    try {
        console.log("📨 Sending:", mail.email);

        mail.status = "PROCESSING";
        await mail.save();

        await transporter.sendMail({
            from: `"Bulk Mailer" <${process.env.MAIL_USER}>`,
            to: mail.email,
            subject: "Bulk Email",
            text: finalMessage
        });

        mail.status = "SENT";
        mail.message = finalMessage;
        await mail.save();
    } catch (err) {
        console.error("❌ Failed:", mail.email, err.message);
        mail.status = "FAILED";
        await mail.save();
    }
}
};

setInterval(processEmails, DELAY);