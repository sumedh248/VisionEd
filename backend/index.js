import express from "express";
import UserModel from "./models/UserModel.js";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { dirname, join } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const app=express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

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

app.post("/career-predict", (req, res) => {
    const scores = req.body;
    const categories = ["analytical", "creativity", "social", "tech"];

    const topCategory = categories.reduce((best, category) => {
        return Number(scores[category] || 0) > Number(scores[best] || 0)
            ? category
            : best;
    }, categories[0]);

    res.json({
        category: topCategory,
        scores,
        ...careerProfiles[topCategory]
    });
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

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured" });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a career guidance expert."
                    },
                    {
                        role: "user",
                        content: `
Generate a structured career roadmap for "${career}".

Student strengths:
${JSON.stringify(strengths || {}, null, 2)}

STRICT RULES:
- Output ONLY valid JSON
- No extra text
- 5 to 7 steps
- Each step must include: title, description
- Personalize the roadmap based on strengths when provided

Format:
{
  "career": "",
  "steps": [
    { "title": "", "description": "" }
  ]
}
`
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "VisionEd AI Career Guide"
                }
            }
        );

        let text = response.data.choices[0].message.content;
        text = text.replace(/```json|```/g, "").trim();

        const json = JSON.parse(text);
        res.json(json);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: "Roadmap generation failed" });
    }
});

app.get("/allUsers",async (req,res)=>{
    let tempUsers = [
    {
        name: "Rahul Sharma",
        email: "rahul.sharma@gmail.com",
        phone: 9876543210,
        password: "Rahul@123",
        standard: "12th",
        marks: "92%",
        hobbies: "Cricket, Reading"
    },
    {
        name: "Priya Patel",
        email: "priya.patel@gmail.com",
        phone: 8765432109,
        password: "Priya@456",
        standard: "11th",
        marks: "88%",
        hobbies: "Dancing, Painting"
    },
    {
        name: "Amit Desai",
        email: "amit.desai@yahoo.com",
        phone: 7654321098,
        password: "Amit@789",
        standard: "10th",
        marks: "95%",
        hobbies: "Football, Gaming"
    },
    {
        name: "Sneha Kulkarni",
        email: "sneha.kulkarni@outlook.com",
        phone: 6543210987,
        password: "Sneha@321",
        standard: "12th",
        marks: "78%",
        hobbies: "Singing, Cooking"
    },
    {
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        phone: 9512367845,
        password: "Vikram@654",
        standard: "11th",
        marks: "85%",
        hobbies: "Chess, Coding"
    },
    {
        name: "Anjali Mehta",
        email: "anjali.mehta@gmail.com",
        phone: 9823456710,
        password: "Anjali@987",
        standard: "10th",
        marks: "90%",
        hobbies: "Drawing, Swimming"
    },
    {
        name: "Rohan Joshi",
        email: "rohan.joshi@gmail.com",
        phone: 7896541230,
        password: "Rohan@111",
        standard: "12th",
        marks: "72%",
        hobbies: "Basketball, Music"
    },
    {
        name: "Neha Gupta",
        email: "neha.gupta@outlook.com",
        phone: 8907654321,
        password: "Neha@222",
        standard: "11th",
        marks: "96%",
        hobbies: "Reading, Yoga"
    },
    {
        name: "Arjun Nair",
        email: "arjun.nair@yahoo.com",
        phone: 9345678901,
        password: "Arjun@333",
        standard: "10th",
        marks: "81%",
        hobbies: "Cycling, Photography"
    },
    {
        name: "Pooja Verma",
        email: "pooja.verma@gmail.com",
        phone: 9012345678,
        password: "Pooja@444",
        standard: "12th",
        marks: "89%",
        hobbies: "Sketching, Gardening"
    }
];
await UserModel.insertMany(tempUsers);
res.send("Data inserted");
});

app.post("/signup", async (req, res) => {
  console.log("API HIT");
  console.log("BODY:", req.body);

  try {
    const {
      username,
      email,
      phone,
      standard,
      marks,
      hobbies,
      password,
    } = req.body;

    // ✅ validation
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user (ADD NEW FIELDS HERE)
    const newUser = new UserModel({
      name: username,
      email,
      phone,
      standard,
      marks,
      hobbies,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: {
        name: newUser.name,
        email: newUser.email,
        standard: newUser.standard,
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

    // find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

if (MONGO_URL) {
    mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB Atlas Connected");
    })
    .catch((err) => {
        console.log("Connection Failed", err.message);
    });
} else {
    console.log("MONGO_URL not found. Starting server without database connection.");
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
