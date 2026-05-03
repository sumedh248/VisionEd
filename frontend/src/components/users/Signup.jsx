import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Signupimg from "../../assets/signup.jpeg";
import { completeUserOnboarding, supabase } from "../../supabaseClient";
import { API_BASE_URL } from "../../utils/api";
import { fetchColleges } from "../colleges/collegeData";

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
    maxWidth: "920px",
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
  },
  overlayTagline: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
    lineHeight: "1.6",
    maxWidth: "230px",
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
  stepPill: {
    width: "fit-content",
    padding: "5px 10px",
    borderRadius: "999px",
    background: "rgba(26,158,106,0.1)",
    color: "#1a7a50",
    fontSize: "12px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  fieldGroup: {
    marginBottom: "14px",
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
  },
  select: {
    appearance: "none",
    cursor: "pointer",
  },
  inputFocused: {
    borderColor: "#1a9e6a",
    boxShadow: "0 0 0 3px rgba(26,158,106,0.12)",
    background: "#fff",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "18px",
  },
  roleButton: {
    minHeight: "86px",
    borderRadius: "12px",
    border: "1.5px solid rgba(26,158,106,0.2)",
    background: "#f4faf7",
    color: "#1a3328",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  activeRoleButton: {
    borderColor: "#1a9e6a",
    background: "rgba(26,158,106,0.1)",
    boxShadow: "0 0 0 3px rgba(26,158,106,0.12)",
  },
  optionRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "14px",
  },
  optionButton: {
    padding: "12px",
    borderRadius: "10px",
    border: "1.5px solid rgba(26,158,106,0.2)",
    background: "#f4faf7",
    color: "#1a3328",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    fontWeight: "600",
  },
  activeOptionButton: {
    borderColor: "#1a9e6a",
    background: "rgba(26,158,106,0.1)",
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
    cursor: "pointer",
    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
  },
  ghostBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
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
  },
  secondaryBtn: {
    background: "transparent",
    border: "none",
    color: "#1a9e6a",
    fontWeight: "600",
    cursor: "pointer",
    padding: "10px 0 0",
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

const interestChoices = [
  "Technology",
  "Science",
  "Business",
  "Design",
  "Healthcare",
  "Writing",
  "Sports",
  "Teaching",
];

function Field({
  name,
  label,
  type = "text",
  icon,
  placeholder,
  value,
  onChange,
  focused,
  setFocused,
  required = true,
  min,
  max,
}) {
  const inputStyle = {
    ...styles.input,
    ...(focused === name ? styles.inputFocused : {}),
  };

  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrapper}>
        <i className={icon} style={styles.inputIcon} />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused("")}
          required={required}
          min={min}
          max={max}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

function SelectField({
  name,
  label,
  icon,
  value,
  onChange,
  focused,
  setFocused,
  children,
  disabled = false,
}) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrapper}>
        <i className={icon} style={styles.inputIcon} />
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused("")}
          required
          disabled={disabled}
          style={{
            ...styles.input,
            ...styles.select,
            ...(focused === name ? styles.inputFocused : {}),
            ...(disabled ? { opacity: 0.7, cursor: "not-allowed" } : {}),
          }}
        >
          {children}
        </select>
      </div>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState("account");
  const [authUser, setAuthUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    current_class: "",
    interests: [],
    graduation_year: "",
    current_company: "",
    job_role: "",
    college_id: "",
    degree: "",
    field_of_study: "",
  });
  const [colleges, setColleges] = useState([]);
  const [collegeStatus, setCollegeStatus] = useState("idle");
  const [focused, setFocused] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const loadGoogleUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setAuthUser(user);
      setFormData((prev) => ({
        ...prev,
        name:
          prev.name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "",
        email: prev.email || user.email || "",
      }));
      setStep("role");
    };

    loadGoogleUser();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadColleges = async () => {
      try {
        setCollegeStatus("loading");
        const data = await fetchColleges();

        if (isMounted) {
          setColleges(data);
          setCollegeStatus("ready");
        }
      } catch (err) {
        if (isMounted) {
          setCollegeStatus("error");
          setError(err.message || "Could not load colleges.");
        }
      }
    };

    loadColleges();

    return () => {
      isMounted = false;
    };
  }, []);

  const heading = useMemo(() => {
    if (step === "account") return "Create your account";
    if (step === "role") return "Who are you?";
    return formData.role === "student" ? "Student details" : "Alumni details";
  }, [formData.role, step]);

  const subheading = useMemo(() => {
    if (step === "account") return "Start with just the essentials.";
    if (step === "role") return "Choose the profile that matches you.";
    return formData.role === "student"
      ? "Tell us your class and interests."
      : "Tell us about your college and current work.";
  }, [formData.role, step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      };
    });
    setError("");
  };

  const goToRoleStep = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please enter your name, email, and password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setStep("role");
  };

  const selectRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    setError("");
    setStep("details");
  };

  const validateDetails = () => {
    if (!formData.role) return "Please select Student or Alumni.";

    if (formData.role === "student") {
      if (!formData.current_class) return "Please select your standard.";
      if (!formData.interests.length) return "Please select at least one interest.";
    }

    if (formData.role === "alumni") {
      if (
        !formData.graduation_year ||
        !formData.current_company ||
        !formData.job_role ||
        !formData.college_id ||
        !formData.degree ||
        !formData.field_of_study
      ) {
        return "Please complete the alumni form.";
      }
    }

    return "";
  };

  const buildProfilePayload = () => ({
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
    role: formData.role,
    current_class: formData.role === "student" ? formData.current_class : null,
    interests: formData.role === "student" ? formData.interests : null,
    graduation_year:
      formData.role === "alumni" ? Number(formData.graduation_year) : null,
    current_company:
      formData.role === "alumni" ? formData.current_company.trim() : null,
    job_role: formData.role === "alumni" ? formData.job_role.trim() : null,
    college_id: formData.role === "alumni" ? formData.college_id : null,
    degree: formData.role === "alumni" ? formData.degree.trim() : null,
    field_of_study:
      formData.role === "alumni" ? formData.field_of_study.trim() : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const detailsError = validateDetails();
    if (detailsError) {
      setError(detailsError);
      return;
    }

    setLoading(true);
    try {
      if (authUser) {
        const profile = await completeUserOnboarding(authUser, buildProfilePayload());
        localStorage.setItem("user", JSON.stringify(profile));
        setSuccess("Profile saved. Redirecting...");
        setTimeout(() => navigate("/dashboard"), 900);
      } else {
        const res = await axios.post(`${API_BASE_URL}/signup`, buildProfilePayload());
        setSuccess(res.data.message || "Account created. Please sign in.");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    setGoogleLoading(true);
    setError("");

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/signup`,
      },
    });

    if (googleError) {
      setError(googleError.message || "Google signup failed. Please try again.");
      setGoogleLoading(false);
    }
  };

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

          <div style={styles.formPanel}>
            <div style={styles.stepPill}>
              {step === "account" ? "Step 1 of 3" : step === "role" ? "Step 2 of 3" : "Step 3 of 3"}
            </div>
            <h2 style={styles.heading}>{heading}</h2>
            <p style={styles.subheading}>{subheading}</p>

            {error && (
              <div style={styles.errorBox}>
                <i className="fas fa-circle-exclamation" />
                {error}
              </div>
            )}
            {success && (
              <div style={styles.successBox}>
                <i className="fas fa-circle-check" />
                {success}
              </div>
            )}

            {step === "account" && (
              <form onSubmit={goToRoleStep}>
                <Field
                  name="name"
                  label="Name"
                  icon="fas fa-user"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  icon="fas fa-envelope"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                />
                <Field
                  name="password"
                  label="Password"
                  type="password"
                  icon="fas fa-lock"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  focused={focused}
                  setFocused={setFocused}
                />

                <button type="submit" style={styles.submitBtn}>
                  Continue
                </button>
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={signupWithGoogle}
                  style={{
                    ...styles.ghostBtn,
                    ...(googleLoading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                  }}
                >
                  <i className="fab fa-google" />
                  {googleLoading ? "Opening Google..." : "Continue with Google"}
                </button>
              </form>
            )}

            {step === "role" && (
              <>
                <div style={styles.roleGrid}>
                  <button
                    type="button"
                    onClick={() => selectRole("student")}
                    style={{
                      ...styles.roleButton,
                      ...(formData.role === "student" ? styles.activeRoleButton : {}),
                    }}
                  >
                    <i className="fas fa-user-graduate" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => selectRole("alumni")}
                    style={{
                      ...styles.roleButton,
                      ...(formData.role === "alumni" ? styles.activeRoleButton : {}),
                    }}
                  >
                    <i className="fas fa-briefcase" />
                    Alumni
                  </button>
                </div>
                {!authUser && (
                  <button type="button" style={styles.secondaryBtn} onClick={() => setStep("account")}>
                    Back to account details
                  </button>
                )}
              </>
            )}

            {step === "details" && (
              <form onSubmit={handleSubmit}>
                {formData.role === "student" ? (
                  <>
                    <label style={styles.label}>Standard</label>
                    <div style={styles.optionRow}>
                      {["10th", "12th"].map((standard) => (
                        <button
                          key={standard}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, current_class: standard }))}
                          style={{
                            ...styles.optionButton,
                            ...(formData.current_class === standard ? styles.activeOptionButton : {}),
                          }}
                        >
                          {standard}
                        </button>
                      ))}
                    </div>

                    <label style={styles.label}>Interests</label>
                    <div style={{ ...styles.optionRow, gridTemplateColumns: "1fr 1fr" }}>
                      {interestChoices.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          style={{
                            ...styles.optionButton,
                            ...(formData.interests.includes(interest) ? styles.activeOptionButton : {}),
                          }}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <SelectField
                      name="college_id"
                      label="College"
                      icon="fas fa-building-columns"
                      value={formData.college_id}
                      onChange={handleChange}
                      focused={focused}
                      setFocused={setFocused}
                      disabled={collegeStatus === "loading"}
                    >
                      <option value="">
                        {collegeStatus === "loading" ? "Loading colleges..." : "Select your college"}
                      </option>
                      {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                          {college.name}
                        </option>
                      ))}
                    </SelectField>
                    <Field
                      name="degree"
                      label="Degree"
                      icon="fas fa-graduation-cap"
                      placeholder="B.Tech, MBA, B.Sc"
                      value={formData.degree}
                      onChange={handleChange}
                      focused={focused}
                      setFocused={setFocused}
                    />
                    <Field
                      name="field_of_study"
                      label="Field of Study"
                      icon="fas fa-book-open"
                      placeholder="Computer Science"
                      value={formData.field_of_study}
                      onChange={handleChange}
                      focused={focused}
                      setFocused={setFocused}
                    />
                    <Field
                      name="graduation_year"
                      label="Graduation Year"
                      type="number"
                      icon="fas fa-calendar"
                      placeholder="2024"
                      value={formData.graduation_year}
                      onChange={handleChange}
                      focused={focused}
                      setFocused={setFocused}
                      min="1950"
                      max="2100"
                    />
                    <Field
                      name="current_company"
                      label="Current Company"
                      icon="fas fa-building"
                      placeholder="Company name"
                      value={formData.current_company}
                      onChange={handleChange}
                      focused={focused}
                      setFocused={setFocused}
                    />
                    <Field
                      name="job_role"
                      label="Job Role"
                      icon="fas fa-id-badge"
                      placeholder="Software Engineer"
                      value={formData.job_role}
                      onChange={handleChange}
                      focused={focused}
                      setFocused={setFocused}
                    />
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitBtn,
                    ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}),
                  }}
                >
                  {loading ? "Saving..." : "Finish Signup"}
                </button>
                <button type="button" style={styles.secondaryBtn} onClick={() => setStep("role")}>
                  Back to role selection
                </button>
              </form>
            )}

            <p style={styles.footer}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
