import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  async function createAccount() {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setMessage("Account created successfully!");
    } else {
      setMessage("Could not create account.");
    }
  }

  async function handleLogin() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setLoggedIn(true);
      setMessage("Logged in successfully!");
    } else {
      setMessage("Wrong email or password.");
    }
  }

  if (loggedIn) {
    return (
      <div>
        <h1>Welcome!</h1>
        <p>You are signed in.</p>
      </div>
    );
  }

  return (
  <div>
    <h1>Login Page</h1>

    {/* Login Section */}
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>

    {/* Create Account Section */}
    <div style={{ marginTop: "30px" }}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={createAccount}>
        Create Account
      </button>
    </div>
  </div>
);
}

export default Login;