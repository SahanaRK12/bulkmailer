import { useState } from "react";
import api from "../api/axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
  
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
