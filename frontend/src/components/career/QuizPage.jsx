import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  { id: 1, text: "I enjoy solving mathematical problems.", category: "analytical" },
  { id: 2, text: "I like analyzing data and patterns.", category: "analytical" },
  { id: 3, text: "Logical puzzles excite me.", category: "analytical" },
  { id: 4, text: "I enjoy drawing or designing.", category: "creativity" },
  { id: 5, text: "I like thinking of new ideas.", category: "creativity" },
  { id: 6, text: "I enjoy storytelling or writing.", category: "creativity" },
  { id: 7, text: "I enjoy interacting with people.", category: "social" },
  { id: 8, text: "I am comfortable speaking in public.", category: "social" },
  { id: 9, text: "I like working in teams.", category: "social" },
  { id: 10, text: "I am interested in technology.", category: "tech" },
  { id: 11, text: "I like learning how systems work.", category: "tech" },
  { id: 12, text: "I enjoy coding or gaming.", category: "tech" },
];

const QuizPage = () => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: parseInt(value) });
    setError("");
  };

  const calculateScores = () => {
    let scores = {
      analytical: [],
      creativity: [],
      social: [],
      tech: []
    };

    questions.forEach(q => {
      if (answers[q.id]) {
        scores[q.category].push(answers[q.id]);
      }
    });

    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      analytical: avg(scores.analytical),
      creativity: avg(scores.creativity),
      social: avg(scores.social),
      tech: avg(scores.tech)
    };
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const finalScores = calculateScores();

    console.log("ML Input:", finalScores);

    try {
      setIsSubmitting(true);

      // send to backend
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalScores)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Prediction failed. Please try again.");
      }

      console.log("Prediction:", data);

      navigate("/career", { state: { result: data, scores: finalScores } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Career Guidance Quiz</h2>

      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "15px" }}>
          <p>{q.text}</p>

          {[1, 2, 3, 4, 5].map((val) => (
            <label key={val} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                name={`q-${q.id}`}
                value={val}
                checked={answers[q.id] === val}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
              {val}
            </label>
          ))}
        </div>
      ))}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default QuizPage;
