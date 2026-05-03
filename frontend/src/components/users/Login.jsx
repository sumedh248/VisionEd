import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase, upsertCurrentUser } from "../../supabaseClient";

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
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid rgba(26, 158, 106, 0.15)",
    boxShadow: "0 8px 40px rgba(26, 80, 55, 0.1), 0 2px 8px rgba(26, 80, 55, 0.06)",
    padding: "44px 40px 36px",
    width: "100%",
    maxWidth: "420px",
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "28px",
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a3328",
    letterSpacing: "-0.01em",
  },
  logoAccent: {
    color: "#1a9e6a",
  },
  heading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a3328",
    textAlign: "center",
    marginBottom: "6px",
  },
  subheading: {
    fontSize: "14px",
    color: "rgba(40, 80, 58, 0.6)",
    textAlign: "center",
    marginBottom: "32px",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(40, 80, 58, 0.65)",
    marginBottom: "6px",
  },
  inputWrapper: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(26, 158, 106, 0.5)",
    fontSize: "14px",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "11px 14px 11px 38px",
    fontSize: "14px",
    color: "#1a3328",
    background: "#f4faf7",
    border: "1.5px solid rgba(26, 158, 106, 0.2)",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    marginTop: "8px",
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
  googleBtn: {
    width: "100%",
    padding: "12px",
    background: "#ffffff",
    color: "#1a3328",
    border: "1.5px solid rgba(26, 80, 55, 0.14)",
    borderRadius: "10px",
    fontFamily: "'Sora', sans-serif",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(26, 80, 55, 0.1)",
  },
  dividerText: {
    fontSize: "12px",
    color: "rgba(40, 80, 58, 0.45)",
    fontWeight: "500",
  },
  footer: {
    textAlign: "center",
    fontSize: "14px",
    color: "rgba(40, 80, 58, 0.6)",
  },
  link: {
    color: "#1a9e6a",
    fontWeight: "600",
    textDecoration: "none",
  },
  errorBox: {
    background: "rgba(192, 57, 43, 0.07)",
    border: "1px solid rgba(192, 57, 43, 0.2)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#c0392b",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const redirectTo =
    typeof location.state?.from === "string" && location.state.from.trim()
      ? location.state.from
      : "/";

  const goToNextStep = useCallback((profile) => {
    if (profile?.role) {
      navigate("/dashboard", { replace: true });
      return;
    }

    navigate("/signup", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const syncLoggedInUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      try {
        const profile = await upsertCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(profile || user));
        goToNextStep(profile);
      } catch (err) {
        setError(err.message || "Signed in, but could not save your profile.");
      }
    };

    syncLoggedInUser();
  }, [goToNextStep]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      const profile = await upsertCurrentUser(data.user);
      localStorage.setItem("user", JSON.stringify(profile || data.user));
      goToNextStep(profile);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setGoogleLoading(true);
    setError("");

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (googleError) {
      setError(googleError.message || "Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const focusStyle = (name) =>
    focused === name
      ? { borderColor: "#1a9e6a", boxShadow: "0 0 0 3px rgba(26, 158, 106, 0.12)", background: "#fff" }
      : {};

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />

      <div style={styles.page}>
        <div style={styles.card}>

          {/* Logo */}
          <div style={styles.logoMark}>
            <span style={styles.logoText}>
              Vision<span style={styles.logoAccent}>Ed</span>
            </span>
          </div>

          <h2 style={styles.heading}>Welcome back</h2>
          <p style={styles.subheading}>Sign in to continue your journey</p>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <i className="fas fa-circle-exclamation" style={{ fontSize: "13px" }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <i className="fas fa-envelope" style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required
                  style={{ ...styles.input, ...focusStyle("email") }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <i className="fas fa-lock" style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                  style={{ ...styles.input, ...focusStyle("password") }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = "#158a5a";
                  e.target.style.boxShadow = "0 6px 18px rgba(26, 158, 106, 0.35)";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#1a9e6a";
                e.target.style.boxShadow = "none";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={loginWithGoogle}
            style={{
              ...styles.googleBtn,
              ...(googleLoading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
            }}
            onMouseEnter={(e) => {
              if (!googleLoading) {
                e.target.style.borderColor = "rgba(26, 158, 106, 0.34)";
                e.target.style.boxShadow = "0 6px 18px rgba(26, 80, 55, 0.1)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "rgba(26, 80, 55, 0.14)";
              e.target.style.boxShadow = "none";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <i className="fab fa-google" />
            {googleLoading ? "Opening Google..." : "Continue with Google"}
          </button>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
