import express from "express";
import session from "express-session";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createSupabaseForToken, supabase } from "./schemas/supabaseClient.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const ML_MODEL_URL = process.env.ML_MODEL_URL || "http://127.0.0.1:5001/predict";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const SCORE_KEYS = ["analytical", "creativity", "social", "tech"];
const SCORE_SECTION_ALIASES = {
  analytical: ["analytical", "programming", "algorithms", "dbms", "compiler_design"],
  creativity: ["creativity", "computer_graphics", "software_engineering"],
  social: ["social", "os_networks", "cyber_security"],
  tech: ["tech", "oop", "computer_architecture", "machine_learning", "cloud_computing"],
};
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (curl/Postman) and server-to-server calls.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    name: "visioned.sid",
    secret: process.env.SESSION_SECRET || process.env.SECRET || "visioned_fallback_secret_key_123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

const careerProfiles = {
    analytical: {
        career: "Data Analyst",
        skills: ["Statistics", "Excel or SQL", "Data visualization"],
        colleges: ["IIT Bombay", "NIT Trichy", "Delhi University"],
        roadmap: ["Build math fundamentals", "Learn SQL and Python", "Create data projects"]
    },
    creativity: {
        career: "UI/UX Designer",
        skills: ["Design thinking", "Figma", "Visual communication"],
        colleges: ["NID Ahmedabad", "MIT Institute of Design", "Pearl Academy"],
        roadmap: ["Learn design basics", "Practice wireframes", "Build a portfolio"]
    },
    social: {
        career: "Psychologist",
        skills: ["Communication", "Empathy", "Research"],
        colleges: ["TISS Mumbai", "Christ University", "Delhi University"],
        roadmap: ["Study psychology", "Do internships", "Pursue higher specialization"]
    },
    tech: {
        career: "Software Engineer",
        skills: ["Programming", "Problem solving", "System design"],
        colleges: ["IIT Bombay", "NIT Trichy", "VIT Vellore"],
        roadmap: ["Learn coding basics", "Build projects", "Prepare for internships"]
    }
};

const careerToCategory = Object.entries(careerProfiles).reduce((acc, [category, profile]) => {
  acc[profile.career.toLowerCase()] = category;
  return acc;
}, {});

const normalizeScores = (rawScores = {}) => {
  const normalized = {};

  SCORE_KEYS.forEach((key) => {
    const value = Number(rawScores[key]);
    normalized[key] = Number.isFinite(value) ? value : NaN;
  });

  if (SCORE_KEYS.every((key) => Number.isFinite(normalized[key]))) {
    return normalized;
  }

  const sectionScores = {};

  SCORE_KEYS.forEach((key) => {
    const aliases = SCORE_SECTION_ALIASES[key] || [];
    const values = aliases
      .map((alias) => Number(rawScores[alias]))
      .filter((value) => Number.isFinite(value));

    sectionScores[key] = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : NaN;
  });

  return sectionScores;
};

const areScoresValid = (scores) => {
  return SCORE_KEYS.every((key) => Number.isFinite(scores[key]) && scores[key] >= 1 && scores[key] <= 5);
};

const getTopCategory = (scores) => {
  return SCORE_KEYS.reduce((best, category) => {
    return Number(scores[category] || 0) > Number(scores[best] || 0) ? category : best;
  }, SCORE_KEYS[0]);
};

const normalizeRoadmapSteps = (steps) => {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps
    .map((step) => ({
      title: String(step?.title || "").trim(),
      description: String(step?.description || "").trim(),
    }))
    .filter((step) => step.title);
};

const normalizeSkillList = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => String(skill || "").trim())
    .filter(Boolean);
};

const toRoadmapStrings = (steps) => {
  return steps.map((step) => {
    if (step.description) {
      return `${step.title}: ${step.description}`;
    }
    return step.title;
  });
};

const fallbackRoadmapSteps = (category) => {
  const profile = careerProfiles[category];
  if (!profile || !Array.isArray(profile.roadmap)) {
    return [];
  }

  return profile.roadmap.map((title) => ({ title, description: "" }));
};

const parseCareerInsightsResponse = (rawContent) => {
  const cleaned = String(rawContent || "").replace(/```json|```/gi, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const jsonBlock =
    firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned;

  const parsed = JSON.parse(jsonBlock);

  return {
    skills: normalizeSkillList(parsed?.requiredSkills),
    steps: normalizeRoadmapSteps(parsed?.steps),
  };
};

const fetchCareerInsights = async (career, strengths) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return {
      skills: [],
      steps: [],
      source: "profile-fallback",
    };
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a career guidance expert who returns structured JSON only.",
          },
          {
            role: "user",
            content: `
Generate career insights for "${career}".

Student strengths:
${JSON.stringify(strengths || {}, null, 2)}

STRICT RULES:
- Output ONLY valid JSON
- No extra text
- Include 5 to 8 required skills for this career
- 5 to 7 steps
- Each step must include: title, description
- Keep skills concise and practical for a student

Format:
{
  "career": "",
  "requiredSkills": ["", ""],
  "steps": [
    { "title": "", "description": "" }
  ]
}
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": FRONTEND_ORIGIN,
          "X-Title": "VisionEd AI Career Guide",
        },
      }
    );

    const rawContent = response?.data?.choices?.[0]?.message?.content;
    const insights = parseCareerInsightsResponse(rawContent);

    return {
      skills: insights.skills,
      steps: insights.steps,
      source: OPENROUTER_MODEL,
    };
  } catch (error) {
    console.error("Roadmap generation error:", error.response?.data || error.message);
    return {
      skills: [],
      steps: [],
      source: "profile-fallback",
    };
  }
};

const fetchMlPredictions = async (scores) => {
  try {
    const response = await axios.post(ML_MODEL_URL, scores, { timeout: 8000 });
    const payload = response?.data;
    const predictions = Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : [];

    return predictions
      .map((item) => ({
        career: String(item?.career || "").trim(),
        career_id: item?.career_id || null,
        match: Number(item?.match),
      }))
      .filter((item) => item.career);
  } catch (error) {
    console.error("ML model error:", error.response?.data || error.message);
    return [];
  }
};

const buildCareerResult = async (scores) => {
  const mlPredictions = await fetchMlPredictions(scores);
  const mlTopCareer = mlPredictions[0]?.career || "";
  const categoryFromMl = mlTopCareer ? careerToCategory[mlTopCareer.toLowerCase()] : "";
  const category = categoryFromMl || getTopCategory(scores);
  const profile = careerProfiles[category] || {
    career: mlTopCareer || "Career Explorer",
    skills: [],
    colleges: [],
    roadmap: [],
  };

  const career = mlTopCareer || profile.career;
  const roadmapFromProfile = fallbackRoadmapSteps(category);
  const careerInsights = await fetchCareerInsights(career, scores);
  const roadmapSteps = careerInsights.steps.length ? careerInsights.steps : roadmapFromProfile;
  const skills = careerInsights.skills.length ? careerInsights.skills : profile.skills;

  return {
    category,
    career,
    skills,
    colleges: profile.colleges,
    roadmap: toRoadmapStrings(roadmapSteps),
    roadmapSteps,
    scores,
    mlPredictions,
    sources: {
      mlModel: mlPredictions.length ? ML_MODEL_URL : "rule-based-fallback",
      roadmapModel: careerInsights.source,
      skillsModel: careerInsights.source,
    },
  };
};

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
};

const userDisplayName = (user) =>
  user?.user_metadata?.full_name ||
  user?.user_metadata?.name ||
  user?.email?.split("@")[0] ||
  "Student";

const requireAuth = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Invalid or expired login session" });
  }

  req.user = {
    id: user.id,
    email: user.email,
    name: userDisplayName(user),
  };
  req.supabase = createSupabaseForToken(token);
  next();
};

const buildTestResultPayload = (user, result) => ({
  user_id: user.id,
  username: user.name,
  score: typeof result.score === "number" ? result.score : null,
  category: result.category || "",
  career: result.career || "",
  skills: Array.isArray(result.skills) ? result.skills : [],
  colleges: Array.isArray(result.colleges) ? result.colleges : [],
  roadmap: Array.isArray(result.roadmap) ? result.roadmap : [],
  roadmap_steps: Array.isArray(result.roadmapSteps) ? result.roadmapSteps : [],
  scores: result.scores && typeof result.scores === "object" ? result.scores : {},
  ml_predictions: Array.isArray(result.mlPredictions) ? result.mlPredictions : [],
  sources: result.sources && typeof result.sources === "object" ? result.sources : {},
});

const toClientTestResult = (row) => ({
  ...row,
  roadmapSteps: row.roadmap_steps || row.roadmapSteps || [],
  mlPredictions: row.ml_predictions || row.mlPredictions || [],
  _id: row.id,
});

app.post("/career-predict", async (req, res) => {
  try {
    const scores = normalizeScores(req.body || {});

    if (!areScoresValid(scores)) {
      return res.status(400).json({ message: "Scores must be numbers between 1 and 5" });
    }

    const result = await buildCareerResult(scores);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Prediction failed" });
  }
});

app.get("/generate-roadmap", (req, res) => {
    res.json({
        message: "Roadmap API is running. Send a POST request with { career, strengths } to generate a roadmap.",
        openrouterConfigured: Boolean(process.env.OPENROUTER_API_KEY)
    });
});

app.post("/generate-roadmap", async (req, res) => {
  try {
  const { career, strengths } = req.body;

  if (!career) {
    return res.status(400).json({ error: "Career is required" });
  }

  const roadmapResponse = await fetchCareerInsights(career, strengths || {});
  const category = careerToCategory[String(career).toLowerCase()];
  const fallback = fallbackRoadmapSteps(category);
  const steps = roadmapResponse.steps.length ? roadmapResponse.steps : fallback;

  res.json({
    career,
    requiredSkills: roadmapResponse.skills,
    steps,
    source: roadmapResponse.source,
  });
  } catch (error) {
  console.error(error.response?.data || error.message);
  res.status(500).json({ error: "Roadmap generation failed" });
  }
});



app.post("/signup", async (req, res) => {
  console.log("API HIT");
  console.log("BODY:", req.body);

  try {
    const {
      name,
      username,
      email,
      password,
      role,
      current_class,
      interests,
      graduation_year,
      current_company,
      job_role,
      college_id,
      degree,
      field_of_study,
    } = req.body;
    const displayName = name || username;

    if (!displayName || !email || !password || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!["student", "alumni"].includes(role)) {
      return res.status(400).json({ message: "Please select Student or Alumni." });
    }

    if (role === "student" && !["10th", "12th"].includes(current_class)) {
      return res.status(400).json({ message: "Please select 10th or 12th standard." });
    }

    if (
      role === "alumni" &&
      (!graduation_year || !current_company || !job_role || !college_id || !degree || !field_of_study)
    ) {
      return res.status(400).json({ message: "Please complete the alumni form." });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          role,
        },
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (data.user) {
      const profile = {
        id: data.user.id,
        email,
        name: displayName,
        role,
        current_class: role === "student" ? current_class : null,
        interests:
          role === "student" && Array.isArray(interests)
            ? interests.map((item) => String(item).trim()).filter(Boolean)
            : null,
        graduation_year: role === "alumni" ? Number(graduation_year) : null,
        current_company: role === "alumni" ? current_company : null,
        job_role: role === "alumni" ? job_role : null,
      };

      const { error: profileError } = await supabase.from("users").upsert({
        ...profile,
      });

      if (profileError) {
        console.error("Supabase profile upsert failed:", profileError.message);
        return res.status(400).json({ message: profileError.message });
      }

      if (role === "alumni") {
        const alumniProfile = {
          user_id: data.user.id,
          college_id,
          degree: String(degree).trim(),
          field_of_study: String(field_of_study).trim(),
        };

        const { data: existingAlumniProfile, error: fetchAlumniError } = await supabase
          .from("alumni_profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (fetchAlumniError) {
          console.error("Supabase alumni profile lookup failed:", fetchAlumniError.message);
          return res.status(400).json({ message: fetchAlumniError.message });
        }

        const alumniQuery = existingAlumniProfile
          ? supabase
              .from("alumni_profiles")
              .update(alumniProfile)
              .eq("id", existingAlumniProfile.id)
          : supabase.from("alumni_profiles").insert({
              ...alumniProfile,
              verified: false,
            });

        const { error: alumniError } = await alumniQuery;

        if (alumniError) {
          console.error("Supabase alumni profile save failed:", alumniError.message);
          return res.status(400).json({ message: alumniError.message });
        }
      }
    }

    res.status(201).json({
      message: data.session
        ? "Signup successful"
        : "Signup successful. Please check your email to confirm your account.",
      user: {
        id: data.user?.id,
        name: displayName,
        email,
        role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = data.user;
    const profile = {
      id: user.id,
      name: userDisplayName(user),
      email: user.email,
    };

    await supabase.from("users").upsert(profile);

    res.json({
      message: "Login successful",
      user: profile,
      session: data.session,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/session", requireAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    user: req.user,
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("visioned.sid", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    res.json({ message: "Logged out successfully" });
  });
});

app.post("/submit-test", requireAuth, async (req, res) => {
  try {
    const scorePayload = req.body?.scores && typeof req.body.scores === "object" ? req.body.scores : req.body;
    const scores = normalizeScores(scorePayload || {});

    if (!areScoresValid(scores)) {
      return res.status(400).json({ message: "Scores must be numbers between 1 and 5" });
    }

    const result = await buildCareerResult(scores);
    const selectedScore = Number.isFinite(scores[result.category]) ? scores[result.category] : null;

    let savedAssessment = null;
    // Store full AI result inside the JSONB score column so it can be
    // retrieved on the dashboard later without re-running the ML model.
    const scorePayloadToSave = {
      ...scores,
      _career: result.career,
      _category: result.category,
      _skills: result.skills,
      _colleges: result.colleges,
      _roadmap: result.roadmap,
      _roadmapSteps: result.roadmapSteps,
    };
    const { data: assessment, error: assessmentError } = await req.supabase
      .from("assessments")
      .insert({
        user_id: req.user.id,
        score: scorePayloadToSave
      })
      .select()
      .single();

    if (assessmentError) {
      throw assessmentError;
    }
    
    savedAssessment = assessment;

    if (assessment && result.mlPredictions && result.mlPredictions.length > 0) {
      const predictionsToInsert = result.mlPredictions.map(p => ({
        assessment_id: assessment.id,
        career_id: p.career_id,
        confidence_score: p.match
      }));

      const { error: predictionsError } = await req.supabase
        .from("career_predictions")
        .insert(predictionsToInsert);
        
      if (predictionsError) {
        console.error("Error inserting career_predictions:", predictionsError);
        throw predictionsError;
      }
    }

    res.status(201).json({
      message: "Test submitted and saved successfully",
      result,
      savedResultId: savedAssessment.id,
      username: req.user.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit test", error: err.message || err.details });
  }
});

app.post("/save-test-result", requireAuth, async (req, res) => {
  try {
    const { scores, mlPredictions } = req.body;

    let savedAssessment = null;
    const { data: assessment, error: assessmentError } = await req.supabase
      .from("assessments")
      .insert({
        user_id: req.user.id,
        score: scores
      })
      .select()
      .single();

    if (assessmentError) {
      throw assessmentError;
    }

    savedAssessment = assessment;

    if (assessment && mlPredictions && mlPredictions.length > 0) {
      const predictionsToInsert = mlPredictions.map(p => ({
        assessment_id: assessment.id,
        career_id: p.career_id,
        confidence_score: p.match
      }));

      const { error: predictionsError } = await req.supabase
        .from("career_predictions")
        .insert(predictionsToInsert);

      if (predictionsError) {
        console.error("Error inserting career_predictions:", predictionsError);
        throw predictionsError;
      }
    }

    res.status(201).json({
      message: "Test result saved successfully",
      result: { _id: savedAssessment.id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save test result", error: err.message || err.details });
  }
});

app.get("/test-results/me", requireAuth, async (req, res) => {
  try {
    const { data: assessments, error } = await req.supabase
      .from("assessments")
      .select(`
        id,
        score,
        created_at,
        career_predictions (
          career_id,
          confidence_score
        )
      `)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const { data: careersData } = await req.supabase.from("careers").select("id, name");
    const careerMap = {};
    if (careersData) {
      careersData.forEach(c => { careerMap[c.id] = c.name; });
    }

    const results = (assessments || []).map(assessment => {
      const stored = assessment.score || {};
      // Separate raw aptitude scores from the metadata fields we prefixed with _
      const scores = Object.fromEntries(
        Object.entries(stored).filter(([k]) => !k.startsWith("_"))
      );
      const mlPredictions = (assessment.career_predictions || [])
        .map(p => ({
          career: careerMap[p.career_id] || "Unknown Career",
          match: p.confidence_score
        }))
        .sort((a, b) => b.match - a.match);

      // Prefer AI-generated data stored at submit time; fall back to profile
      const storedCareer   = stored._career || "";
      const storedCategory = stored._category || "";
      const topCareer = mlPredictions[0]?.career || storedCareer || "";
      const categoryFromMl = topCareer ? careerToCategory[topCareer.toLowerCase()] : "";
      const category = categoryFromMl || storedCategory || getTopCategory(scores);
      const profile  = careerProfiles[category] || { skills: [], colleges: [], roadmap: [] };

      const storedRoadmapSteps = Array.isArray(stored._roadmapSteps) ? stored._roadmapSteps : [];
      const storedRoadmap      = Array.isArray(stored._roadmap)      ? stored._roadmap      : [];
      const storedSkills       = Array.isArray(stored._skills)       ? stored._skills       : [];
      const storedColleges     = Array.isArray(stored._colleges)     ? stored._colleges     : [];

      return {
        _id: assessment.id,
        id: assessment.id,
        scores: scores,
        category: category,
        career: topCareer || profile.career,
        skills:       storedSkills.length    ? storedSkills    : profile.skills,
        colleges:     storedColleges.length  ? storedColleges  : profile.colleges,
        roadmap:      storedRoadmap.length   ? storedRoadmap   : toRoadmapStrings(fallbackRoadmapSteps(category)),
        roadmapSteps: storedRoadmapSteps.length ? storedRoadmapSteps : fallbackRoadmapSteps(category),
        mlPredictions: mlPredictions,
        createdAt: assessment.created_at,
        created_at: assessment.created_at
      };
    });

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch test results" });
  }
});

app.get("/test-results/:username", requireAuth, async (req, res) => {
  try {
    const { username } = req.params;

    if (username !== req.user.name) {
      return res.status(403).json({ message: "You can only access your own results" });
    }

    const { data: assessments, error } = await req.supabase
      .from("assessments")
      .select(`
        id,
        score,
        created_at,
        career_predictions (
          career_id,
          confidence_score
        )
      `)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const { data: careersData } = await req.supabase.from("careers").select("id, name");
    const careerMap = {};
    if (careersData) {
      careersData.forEach(c => { careerMap[c.id] = c.name; });
    }

    const results = (assessments || []).map(assessment => {
      const scores = assessment.score || {};
      const mlPredictions = (assessment.career_predictions || [])
        .map(p => ({
          career: careerMap[p.career_id] || "Unknown Career",
          match: p.confidence_score
        }))
        .sort((a, b) => b.match - a.match);

      const topCareer = mlPredictions[0]?.career || "";
      const categoryFromMl = topCareer && careerToCategory ? careerToCategory[topCareer.toLowerCase()] : "";
      const category = categoryFromMl || getTopCategory(scores);
      const profile = careerProfiles[category] || { skills: [], colleges: [], roadmap: [] };

      return {
        _id: assessment.id,
        id: assessment.id,
        scores: scores,
        category: category,
        career: topCareer || profile.career,
        skills: profile.skills,
        colleges: profile.colleges,
        roadmap: toRoadmapStrings(fallbackRoadmapSteps(category)),
        roadmapSteps: fallbackRoadmapSteps(category),
        mlPredictions: mlPredictions,
        createdAt: assessment.created_at,
        created_at: assessment.created_at
      };
    });

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch test results" });
  }
});

app.post("/connections", requireAuth, async (req, res) => {
  try {
    const { receiver_id } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ message: "receiver_id is required" });
    }

    if (req.user.id === receiver_id) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const { data: existing, error: checkError } = await req.supabase
      .from("connections")
      .select("id, status")
      .eq("sender_id", req.user.id)
      .eq("receiver_id", receiver_id)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existing) {
      return res.status(400).json({ message: `Connection is already ${existing.status}` });
    }

    const { data, error } = await req.supabase
      .from("connections")
      .insert({
        sender_id: req.user.id,
        receiver_id: receiver_id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: "Connection request sent successfully", connection: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create connection" });
  }
});

app.get("/alumni/dashboard", requireAuth, async (req, res) => {
  try {
    const { data: alumniProfile, error: profileError } = await req.supabase
      .from("alumni_profiles")
      .select("*, colleges ( name, location )")
      .eq("user_id", req.user.id)
      .single();

    if (profileError) throw profileError;

    const { data: connections, error: connError } = await req.supabase
      .from("connections")
      .select("*")
      .eq("receiver_id", req.user.id)
      .order("created_at", { ascending: false });

    if (connError) throw connError;

    let connectionsWithSenders = connections || [];

    if (connectionsWithSenders.length > 0) {
      const senderIds = [...new Set(connectionsWithSenders.map(c => c.sender_id))];
      const { data: senders, error: sendersError } = await req.supabase
        .from("users")
        .select("id, name, email, profile_image, current_class, interests")
        .in("id", senderIds);

      if (!sendersError && senders) {
        connectionsWithSenders = connectionsWithSenders.map(c => ({
          ...c,
          sender: senders.find(s => s.id === c.sender_id) || null
        }));
      }
    }

    // Sort: pending first
    connectionsWithSenders.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json({
      profile: {
        ...req.user,
        ...alumniProfile
      },
      connections: connectionsWithSenders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load alumni dashboard" });
  }
});

app.patch("/connections/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const { data, error } = await req.supabase
      .from("connections")
      .update({ status })
      .eq("id", req.params.id)
      .eq("receiver_id", req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: `Connection ${status}`, connection: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update connection" });
  }
});

// --- CHAT API ---
app.get("/chat/contacts", requireAuth, async (req, res) => {
  try {
    const { data: connections, error } = await req.supabase
      .from("connections")
      .select("*")
      .eq("status", "accepted")
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`);

    if (error) throw error;

    const contactIds = [...new Set(connections.map(c => 
      c.sender_id === req.user.id ? c.receiver_id : c.sender_id
    ))];

    if (contactIds.length === 0) {
      return res.json({ contacts: [] });
    }

    const { data: users, error: usersError } = await req.supabase
      .from("users")
      .select("id, name, email, profile_image, role")
      .in("id", contactIds);

    if (usersError) throw usersError;

    res.json({ contacts: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load contacts" });
  }
});

app.post("/chat/conversations", requireAuth, async (req, res) => {
  try {
    const { target_user_id } = req.body;
    if (!target_user_id) return res.status(400).json({ message: "target_user_id is required" });

    const { data: myConversations, error: myConvError } = await req.supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", req.user.id);

    if (myConvError) throw myConvError;

    const myConvIds = myConversations.map(c => c.conversation_id);

    if (myConvIds.length > 0) {
      const { data: commonConv, error: commonConvError } = await req.supabase
        .from("conversation_participants")
        .select("conversation_id")
        .in("conversation_id", myConvIds)
        .eq("user_id", target_user_id)
        .limit(1);

      if (commonConvError) throw commonConvError;

      if (commonConv && commonConv.length > 0) {
        return res.json({ conversation_id: commonConv[0].conversation_id });
      }
    }

    const { data: newConv, error: newConvError } = await req.supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (newConvError) throw newConvError;

    const { error: partError } = await req.supabase
      .from("conversation_participants")
      .insert([
        { conversation_id: newConv.id, user_id: req.user.id },
        { conversation_id: newConv.id, user_id: target_user_id }
      ]);

    if (partError) throw partError;

    res.json({ conversation_id: newConv.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load conversation" });
  }
});

app.get("/chat/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const { data: participant, error: partError } = await req.supabase
      .from("conversation_participants")
      .select("id")
      .eq("conversation_id", req.params.id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (partError || !participant) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const { data: messages, error: msgError } = await req.supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", req.params.id)
      .order("created_at", { ascending: true });

    if (msgError) throw msgError;

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

app.post("/chat/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const { data: participant, error: partError } = await req.supabase
      .from("conversation_participants")
      .select("id")
      .eq("conversation_id", req.params.id)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (partError || !participant) {
      return res.status(403).json({ message: "Not a participant in this conversation" });
    }

    const { data: newMessage, error: msgError } = await req.supabase
      .from("messages")
      .insert({
        conversation_id: req.params.id,
        sender_id: req.user.id,
        message: message.trim()
      })
      .select()
      .single();

    if (msgError) throw msgError;

    res.json({ message: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});
// --- END CHAT API ---

app.use((req, res, next) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ message });
});

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Supabase backend ready");
  });
};

startServer();
