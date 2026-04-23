import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizPage.css";

const SECTIONS = [
  {
    key: "analytical",
    label: "Analytical Thinking",
    questions: [
      { id: 1, text: "I enjoy solving mathematical problems." },
      { id: 2, text: "I like analyzing data and patterns." },
      { id: 3, text: "Logical puzzles excite me." },
    ],
  },
  {
    key: "creativity",
    label: "Creative Expression",
    questions: [
      { id: 4, text: "I enjoy drawing or designing." },
      { id: 5, text: "I like thinking of new ideas." },
      { id: 6, text: "I enjoy storytelling or writing." },
    ],
  },
  {
    key: "social",
    label: "Social & Communication",
    questions: [
      { id: 7, text: "I enjoy interacting with people." },
      { id: 8, text: "I am comfortable speaking in public." },
      { id: 9, text: "I like working in teams." },
    ],
  },
  {
    key: "tech",
    label: "Technology & Systems",
    questions: [
      { id: 10, text: "I am interested in technology." },
      { id: 11, text: "I like learning how systems work." },
      { id: 12, text: "I enjoy coding or gaming." },
    ],
  },
];

const TOTAL_QUESTIONS = SECTIONS.reduce((acc, s) => acc + s.questions.length, 0);

const QuizPage = () => {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const answered = Object.keys(answers).length;
  const progressPct = Math.round((answered / TOTAL_QUESTIONS) * 100);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: parseInt(value) }));
    setError("");
  };

  const calculateScores = () => {
    const sums = { analytical: [], creativity: [], social: [], tech: [] };
    SECTIONS.forEach((section) => {
      section.questions.forEach((q) => {
        if (answers[q.id]) sums[section.key].push(answers[q.id]);
      });
    });
    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    return {
      analytical: avg(sums.analytical),
      creativity: avg(sums.creativity),
      social: avg(sums.social),
      tech: avg(sums.tech),
    };
  };

  const handleSubmit = async () => {
    if (answered !== TOTAL_QUESTIONS) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const finalScores = calculateScores();

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:5000/career-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalScores),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Prediction failed. Please try again.");
      }

      navigate("/career", { state: { result: data, scores: finalScores } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quiz-page">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-header__eyebrow">Career Assessment</div>
        <h1>Discover Your Ideal Career Path</h1>
        <p className="quiz-header__subtitle">
          Rate each statement from 1 (strongly disagree) to 5 (strongly agree).
          There are no right or wrong answers — be honest!
        </p>
      </div>

      {/* Progress */}
      <div className="quiz-progress">
        <div className="quiz-progress__meta">
          <span>{answered} of {TOTAL_QUESTIONS} answered</span>
          <span>{progressPct}%</span>
        </div>
        <div className="quiz-progress__track">
          <div
            className="quiz-progress__fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <React.Fragment key={section.key}>
          <div className="quiz-section-label">
            <span className="quiz-section-label__tag">{section.label}</span>
          </div>

          {section.questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const globalIdx =
              SECTIONS.slice(0, SECTIONS.indexOf(section)).reduce(
                (acc, s) => acc + s.questions.length,
                0
              ) + idx + 1;

            return (
              <div
                key={q.id}
                className={`quiz-question-card ${isAnswered ? "is-answered" : ""}`}
              >
                <div className="quiz-question-card__header">
                  <span className="quiz-question-card__num">{globalIdx}</span>
                  <p className="quiz-question-card__text">{q.text}</p>
                </div>

                <div className="quiz-scale">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val} className="quiz-scale__option">
                      <input
                        type="radio"
                        className="quiz-scale__radio"
                        name={`q-${q.id}`}
                        value={val}
                        checked={answers[q.id] === val}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                      <span className="quiz-scale__dot">{val}</span>
                    </label>
                  ))}
                </div>

                <div className="quiz-scale-legend">
                  <span>Strongly disagree</span>
                  <span>Strongly agree</span>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}

      {/* Error */}
      {error && <div className="quiz-error">{error}</div>}

      {/* Footer / Submit */}
      <div className="quiz-footer">
        <div className="quiz-footer__info">
          <strong>Ready to find your path?</strong>
          {answered < TOTAL_QUESTIONS
            ? `${TOTAL_QUESTIONS - answered} question${TOTAL_QUESTIONS - answered !== 1 ? "s" : ""} remaining`
            : "All questions answered — good to go!"}
        </div>

        <button
          className="quiz-submit-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="quiz-spinner" />
              Analyzing...
            </>
          ) : (
            <>
              See My Results
              <span className="quiz-submit-btn__arrow">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizPage;