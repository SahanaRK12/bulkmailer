import { useEffect, useState } from "react";
import UploadExcel from "./UploadExcel";
import EmailTable from "../components/EmailTable";
import api from "../api/axios";

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const loadEmails = async () => {
    try {
      const res = await api.get("/mail/queue");
      setEmails(res.data);
    } catch (error) {
      console.error("Failed to load emails:", error);
      alert("Failed to load queued emails. Check backend!");
    }
  };
  

  useEffect(() => {
    loadEmails();
  }, []);

  const sendEmails = async () => {
    try {
      await api.post("/mail/send", { message });
      alert("Emails sent successfully");
      loadEmails();
    } catch (error) {
      console.error("Failed to send emails:", error);
      alert("Failed to send emails. Check backend!");
    }
  };
  

  return (
    <div>
      <h1>Bulk Mailer Dashboard</h1>

      <UploadExcel onUploadSuccess={loadEmails} />

      <h2>Queued Emails</h2>
      <EmailTable emails={emails} />
      <h3>Message (use {"{{name}}"})</h3>
<textarea
  rows="5"
  cols="50"
  value={message}
  onChange={e => setMessage(e.target.value)}
/>


      <br /><br />
      <button onClick={sendEmails}>Send Emails</button>
    </div>
  );
}
