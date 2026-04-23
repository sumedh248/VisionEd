import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Signupimg from "../../assets/signup.jpeg";

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(145deg, #e8f5ee 0%, #d4eede 50%, #e2f0e8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "900px",
    minHeight: "560px",
    background: "#ffffff",
    borderRadius: "24px",
    border: "1px solid rgba(26, 158, 106, 0.15)",
    boxShadow: "0 8px 40px rgba(26, 80, 55, 0.1), 0 2px 8px rgba(26, 80, 55, 0.06)",
    overflow: "hidden",
  },
  imagePanel: {
    flex: "0 0 40%",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(160deg, rgba(26,158,106,0.55) 0%, rgba(26,51,40,0.72) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "32px",
  },
  overlayLogo: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "26px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "10px",
    letterSpacing: "-0.01em",
  },
  overlayTagline: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
    lineHeight: "1.6",
    maxWidth: "220px",
    margin: 0,
  },
  formPanel: {
    flex: 1,
    padding: "36px 36px 28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflowY: "auto",
  },
  heading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a3328",
    marginBottom: "4px",
  },
  subheading: {
    fontSize: "13px",
    color: "rgba(40,80,58,0.6)",
    marginBottom: "20px",
  },
  fieldGroup: {
    marginBottom: "11px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "500",
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "rgba(40,80,58,0.6)",
    marginBottom: "5px",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(26,158,106,0.5)",
    fontSize: "13px",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "10px 12px 10px 34px",
    fontSize: "13.5px",
    color: "#1a3328",
    background: "#f4faf7",
    border: "1.5px solid rgba(26,158,106,0.2)",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    boxSizing: "border-box",
    appearance: "none",
    WebkitAppearance: "none",
  },
  inputFocused: {
    borderColor: "#1a9e6a",
    boxShadow: "0 0 0 3px rgba(26,158,106,0.12)",
    background: "#fff",
  },
  inputError: {
    borderColor: "rgba(192,57,43,0.5)",
    background: "#fffafa",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "6px",
    background: "#1a9e6a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontFamily: "'Sora', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.02em",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
  },
  errorBox: {
    background: "rgba(192,57,43,0.07)",
    border: "1px solid rgba(192,57,43,0.2)",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "12.5px",
    color: "#c0392b",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  successBox: {
    background: "rgba(26,158,106,0.08)",
    border: "1px solid rgba(26,158,106,0.25)",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "12.5px",
    color: "#1a7a50",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "rgba(40,80,58,0.6)",
    marginTop: "14px",
  },
  link: {
    color: "#1a9e6a",
    fontWeight: "600",
    textDecoration: "none",
  },
};

const STANDARD_OPTIONS = ["8th", "9th", "10th", "11th", "12th", "Graduate", "Post Graduate"];

const Field = ({
  name,
  label,
  type,
  icon,
  placeholder,
  kind,
  formData,
  handleChange,
  focused,
  setFocused,
  getInputStyle,
}) => (
  <div style={styles.fieldGroup}>
    <label style={styles.label}>{label}</label>

    <div style={styles.inputWrapper}>
      <i className={icon} style={styles.inputIcon} />

      {kind === "select" ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused("")}
          required
          style={getInputStyle(name)}
        >
          <option value="" disabled>Select…</option>
          {STANDARD_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused("")}
          min={type === "number" ? 0 : undefined}
          max={type === "number" ? 100 : undefined}
          required
          style={getInputStyle(name)}
        />
      )}
    </div>
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", email: "", phone: "",
    standard: "", marks: "", hobbies: "",
    password: "", confirmPassword: "",
  });
  const [focused, setFocused] = useState("");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.marks && (Number(formData.marks) < 0 || Number(formData.marks) > 100)) {
      setError("Marks must be between 0 and 100.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/signup", formData);
      setSuccess(res.data.message || "Account created! Redirecting…");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) => ({
    ...styles.input,
    ...(focused === name ? styles.inputFocused : {}),
    ...(error && (name === "password" || name === "confirmPassword") && error.includes("match")
      ? styles.inputError : {}),
  });

  

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />

      <div style={styles.page}>
        <div style={styles.card}>

          {/* Left image panel */}
          <div style={styles.imagePanel}>
            <img src={Signupimg} alt="Students learning" style={styles.image} />
            <div style={styles.imageOverlay}>
              <div style={styles.overlayLogo}>
                Vision<span style={{ color: "#a8f0d4" }}>Ed</span>
              </div>
              <p style={styles.overlayTagline}>
                Discover your strengths and find the career path built for you.
              </p>
            </div>
          </div>

          {/* Right form panel */}
          <div style={styles.formPanel}>
            <h2 style={styles.heading}>Create your account</h2>
            <p style={styles.subheading}>Join VisionEd and unlock your potential</p>

            {error   && <div style={styles.errorBox}><i className="fas fa-circle-exclamation" />{error}</div>}
            {success && <div style={styles.successBox}><i className="fas fa-circle-check" />{success}</div>}

            <form onSubmit={handleSubmit}>

              <Field
                name="username"
                label="Username"
                type="text"
                icon="fas fa-user"
                placeholder="John Doe"
                kind="input"
                formData={formData}
                handleChange={handleChange}
                focused={focused}
                setFocused={setFocused}
                getInputStyle={getInputStyle}
              />
              {/* Email */}
              <Field
                name="email"
                label="Email"
                type="email"
                icon="fas fa-envelope"
                placeholder="you@example.com"
                kind="input"
                formData={formData}
                handleChange={handleChange}
                focused={focused}
                setFocused={setFocused}
                getInputStyle={getInputStyle}
              />

              {/* Phone */}
              <Field
                name="phone"
                label="Phone"
                type="text"
                icon="fas fa-phone"
                placeholder="+91 9876543210"
                kind="input"
                formData={formData}
                handleChange={handleChange}
                focused={focused}
                setFocused={setFocused}
                getInputStyle={getInputStyle}
              />

              {/* Standard + Marks */}
              <div style={styles.row}>
                <Field
                  name="standard"
                  label="Standard"
                  type="text"
                  icon="fas fa-graduation-cap"
                  kind="select"
                  formData={formData}
                  handleChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                  getInputStyle={getInputStyle}
                />

                <Field
                  name="marks"
                  label="Marks (%)"
                  type="number"
                  icon="fas fa-star"
                  placeholder="85"
                  kind="input"
                  formData={formData}
                  handleChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                  getInputStyle={getInputStyle}
                />
              </div>

              {/* Hobbies */}
              <Field
                name="hobbies"
                label="Hobbies"
                type="text"
                icon="fas fa-heart"
                placeholder="Reading, Coding..."
                kind="input"
                formData={formData}
                handleChange={handleChange}
                focused={focused}
                setFocused={setFocused}
                getInputStyle={getInputStyle}
              />

              {/* Password */}
              <div style={styles.row}>
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  icon="fas fa-lock"
                  placeholder="••••••••"
                  kind="input"
                  formData={formData}
                  handleChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                  getInputStyle={getInputStyle}
                />

                <Field
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  icon="fas fa-lock"
                  placeholder="••••••••"
                  kind="input"
                  formData={formData}
                  handleChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                  getInputStyle={getInputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ ...styles.submitBtn, ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}) }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#158a5a"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(26,158,106,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1a9e6a"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p style={styles.footer}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>Sign in</Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}