import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function Signup() {
  const [theme, setTheme] = useState("light");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email is required";

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});

      await registerUser(fullName, email, password);

      navigate("/login");
    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  return (
    <div className={`home ${theme}`}>
      <div className="auth-container pop show">

        <h1 className="pop show">Sign Up</h1>

        <form
          className="auth-form pop show delay-1"
          onSubmit={onSubmit}
        >

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="field-error">
            {errors.fullName || ""}
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="field-error">
            {errors.email || ""}
          </div>

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="field-error">
            {errors.password || ""}
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="field-error">
            {errors.confirmPassword || ""}
          </div>

          {/* Backend / form error */}
          {errors.form && (
            <div className="error-box">
             {errors.form}
            </div>
          )}


          <button className="btn signup" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-link pop show delay-2">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log In</span>
        </p>

        {/* Theme toggle */}
        <div className="theme-icons pop show delay-3">
          <span
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
          >
            ☀️
          </span>
          <span
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
          >
            🌙
          </span>
        </div>
      </div>
    </div>
  );
}
