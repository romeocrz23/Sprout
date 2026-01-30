import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; 

export default function Login() {
  const [theme, setTheme] = useState("light");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});

      await loginUser(email, password);

      navigate("/dashboard");

    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  return (
    <div className={`home ${theme}`}>

      <div className="auth-container pop show">

        <h1 className="pop show">Log In</h1>

        <form className="auth-form pop show delay-1" onSubmit={onSubmit}>

          {/* Email */}
          <div className="field-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="field-error">
              {errors.email || ""}
            </div>
          </div>

          {/* Password */}
          <div className="field-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="field-error">
              {errors.password || ""}
            </div>
          </div>

          {/* Backend error */}
          {errors.form && (
            <div className="error-box">
              {errors.form}
            </div>
          )}

          <button className="btn login" type="submit">
            Log In
          </button>
        </form>

        <p className="auth-link pop show delay-2">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>

        {/* Toggle */}
        <div className="theme-icons inline pop show delay-3">
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
