import { useState } from "react";
import axios from "axios";

const UploadExcel = () => {
const [selectedFile, setSelectedFile] = useState(null);

const handleFileChange = (e) => {
setSelectedFile(e.target.files[0]);
};

const upload = async () => {
if (!selectedFile) {
    alert("Please select an Excel file");
    return;
}

const formData = new FormData();
formData.append("file", selectedFile); // 🔴 MUST be "file"

const token = localStorage.getItem("token");

try {
    const res = await axios.post(
    "http://localhost:5000/api/mail/upload",
    formData,
    {
        headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
        }
    }
    );

    alert(res.data.message);
} catch (err) {
    console.error(err.response?.data || err.message);
    alert("Upload failed");
}
};

return (
<div>
    <h2>Upload Excel</h2>

    <input
    type="file"
    accept=".xlsx,.xls"
    onChange={handleFileChange}
    />

    <button onClick={upload}>Upload</button>
</div>
);
};

export default UploadExcel;