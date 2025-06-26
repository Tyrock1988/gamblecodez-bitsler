import React, { useState } from "react";

const ADMIN_USER = "Admin";
const ADMIN_PASS = "Pink2222";

export default function App() {
  const [username, setUsername] = useState("");
  const [referral, setReferral] = useState("");
  const [message, setMessage] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);

  async function handleSignup(e) {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, referral }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Signup successful!");
      setUsername("");
      setReferral("");
    } else {
      setMessage(data.error || "Signup failed");
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      const authHeader = "Basic " + btoa(`${adminUser}:${adminPass}`);
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setAdminLoggedIn(true);
        setMessage("");
      } else {
        setMessage("Admin login failed");
      }
    } else {
      setMessage("Invalid admin credentials");
    }
  }

  if (adminLoggedIn) {
    return (
      <div>
        <h2>Admin Dashboard</h2>
        <button onClick={() => setAdminLoggedIn(false)}>Logout</button>
        <ul>
          {users.map((u, i) => (
            <li key={i}>
              {u.username} - {u.referral || "No referral"} - {u.date}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          placeholder="Referral (optional)"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Signup
        </button>
      </form>
      <p>{message}</p>

      <hr />

      <h2>Admin Login</h2>
      <form onSubmit={handleAdminLogin}>
        <input
          placeholder="Admin Username"
          value={adminUser}
          onChange={(e) => setAdminUser(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          placeholder="Admin Password"
          type="password"
          value={adminPass}
          onChange={(e) => setAdminPass(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
