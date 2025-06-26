import React, { useState } from "react";

const API_BASE = "/api"; // Fly.io will handle base routing

const App = () => {
  const [referralUrl] = useState("https://yourdynamicreferralsystem.com/?ref=GambaCodez");
  const [loginStatus, setLoginStatus] = useState(null);
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [users, setUsers] = useState([]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
      const data = await res.json();
      setLoginStatus(data.success ? "Logged in ✅" : "Access denied ❌");
    } catch {
      setLoginStatus("Error logging in ❌");
    }
  };

  const handleAddUser = async () => {
    await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    fetchUsers();
  };

  const fetchUsers = async () => {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    setUsers(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">🎰 GambleCodez Dashboard</h1>

      <a
        href={referralUrl}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        🎁 Claim Your Bonus
      </a>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Admin Login</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Username"
          onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Password"
          type="password"
          onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleLogin}>
          🔐 Log In
        </button>
        {loginStatus && <p className="mt-2">{loginStatus}</p>}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Add New User</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddUser}>
          ➕ Add User
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">📋 Current Users</h2>
        <button className="bg-gray-600 text-white px-4 py-2 rounded mb-2" onClick={fetchUsers}>
          🔄 Refresh List
        </button>
        <ul className="text-left">
          {users.map((u, i) => (
            <li key={i} className="border-b py-1">
              {u.name} — {u.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;