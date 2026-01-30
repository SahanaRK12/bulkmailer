// import XLSX from "xlsx";
// import { EmailBatch, EmailQueue } from "../models/index.js";
// import { transporter } from "../utils/mailer.js";

// export const uploadExcel = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const workbook = XLSX.read(req.file.buffer);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(sheet);

//     console.log("RAW EXCEL DATA:", data);

//     const batch = await EmailBatch.create({
//       fileName: req.file.originalname,
//       UserId: req.user.id
//     });

//     const emails = data
//       .map(row => {
//         const email =
//           row.email ||
//           row.Email ||
//           row.EMAIL ||
//           row["email address"] ||
//           row["Email Address"];

//         const name =
//           row.name ||
//           row.Name ||
//           row.NAME;

//         if (!email || !name) return null;

//         return {
//           email: email.toString().trim(),
//           name: name.toString().trim(),
//           message: null,
//           EmailBatchId: batch.id
//         };
//       })
//       .filter(Boolean);

//     if (emails.length === 0) {
//       return res.status(400).json({
//         message: "Excel file contains no valid email rows"
//       });
//     }
//     console.log("FINAL EMAIL OBJECTS:", emails);
//     await EmailQueue.bulkCreate(emails);

//     res.json({ message: "Emails queued successfully" });
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getQueuedEmails = async (req, res) => {
//   try {
//     const emails = await EmailQueue.findAll({
//       where: { status: "PENDING" }
//     });
//     res.json(emails);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// export const sendBulkEmails = async (req, res) => {
//   const { message } = req.body;

//   if (!message || !message.trim()) {
//     return res.status(400).json({ message: "Message required" });
//   }

//   const emails = await EmailQueue.findAll({
//     where: { status: "PENDING" }
//   });

//   for (const mail of emails) {
//     const finalMessage = message.replace(/{{name}}/gi, mail.name || "");

//     console.log("📨 Sending email to:", mail.email);
//     console.log("📨 Email body:", finalMessage);

//     try {
//       await transporter.sendMail({
//         from: `"Bulk Mailer" <${process.env.MAIL_USER}>`, // ✅ FIX
//         to: mail.email,
//         subject: "Bulk Email",
//         text: finalMessage
//       });

//       mail.message = finalMessage;
//       mail.status = "SENT";
//       await mail.save();
//     } catch (err) {
//       console.error("❌ Mail failed:", err);
//       mail.status = "FAILED";
//       await mail.save();
//     }
//   }

//   res.json({ message: "Emails sent successfully" });
// };



// AFTERNOON ADDITION

import XLSX from "xlsx";
import { EmailBatch, EmailQueue } from "../models/index.js";

/**
 * Upload Excel and push emails into DB queue
 */
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const batch = await EmailBatch.create({
      fileName: req.file.originalname,
      UserId: req.user.id
    });

    const emails = data
      .map(row => {
        const email =
          row.email ||
          row.Email ||
          row.EMAIL ||
          row["email address"] ||
          row["Email Address"];

        const name =
          row.name ||
          row.Name ||
          row.NAME;

        if (!email || !name) return null;

        return {
          email: email.toString().trim(),
          name: name.toString().trim(),
          status: "PENDING",
          message: null,
          EmailBatchId: batch.id
        };
      })
      .filter(Boolean);

    if (emails.length === 0) {
      return res.status(400).json({
        message: "Excel file contains no valid email rows"
      });
    }

    await EmailQueue.bulkCreate(emails);

    res.json({
      message: "Emails added to queue successfully",
      totalQueued: emails.length
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * View pending emails
 */
export const getQueuedEmails = async (req, res) => {
  try {
    const emails = await EmailQueue.findAll({
      where: { status: "PENDING" }
    });
    res.json(emails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Just a trigger endpoint (NO email sending here)
 */
export const sendBulkEmails = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message required" });
  }

  // Save the message in all pending emails
  await EmailQueue.update(
    { message: message },
    { where: { status: "PENDING" } }
  );

  res.json({ message: "Message saved. Worker will send emails." });
};


export const pauseEmails = async (req, res) => {
  await EmailSettings.update(
    { is_paused: true },
    { where: { id: 1 } }
  );

  res.json({ message: "Email sending paused" });
};

export const resumeEmails = async (req, res) => {
  await EmailSettings.update(
    { is_paused: false },
    { where: { id: 1 } }
  );

  res.json({ message: "Email sending resumed" });
};