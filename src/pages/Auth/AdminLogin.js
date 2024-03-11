import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // New state for error messages
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      // Show success notification
      toast.success("Login successful!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/auth/adminlogin",
        data
      );

      const token = response.data; // Assuming the token is returned in the response data

      if (token) {
        // store the token in frontend
        localStorage.setItem("token", token);

        // Use this as the default token for axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate("/home");
      } else {
        console.log("Login error");
        setError(""); // Clear any previous error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password."); // Set error message
    }
  };

  return (
    <div className="login-box">
      <div className="text-center mb-5">
        <h1>Admin Login</h1>
      </div>
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control"
            onChange={handleUsername}
            placeholder="Username"
            required
          />
        </div>

        <div className="form-group mb-3">
          <input
            type="password"
            className="form-control"
            onChange={handlePassword}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div>
          <p>If you don't have account ?
           <a  href="/register">Register</a>
          </p>
        </div>
        <div class="p-3 mb-2 bg-warning text-dark">

        </div>

        {error && <p className="text-danger mt-3">{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default AdminLogin;