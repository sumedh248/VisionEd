import React, { useState } from "react";
import "./TestCreator.css";

function TestCreator() {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", ""],
      correct: ""
    }
  ]);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", ""], correct: "" }
    ]);
  };

  const setCorrect = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correct = value;
    setQuestions(updated);
  };

  return (
    <div className="form-container">
      <h2>Create Test</h2>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-card">

          {/* Question */}
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) =>
              handleQuestionChange(qIndex, e.target.value)
            }
            className="form-control mb-2"
          />

          {/* Options */}
          {q.options.map((opt, oIndex) => (
            <input
              key={oIndex}
              type="text"
              placeholder={`Option ${oIndex + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(qIndex, oIndex, e.target.value)
              }
              className="form-control mb-2"
            />
          ))}

          <button
            className="btn btn-sm btn-outline-success mb-3"
            onClick={() => addOption(qIndex)}
          >
            + Add Option
          </button>

          {/* Correct Answer Selector */}
          <select
            className="form-select"
            value={q.correct}
            onChange={(e) => setCorrect(qIndex, e.target.value)}
          >
            <option value="">Select Correct Answer</option>
            {q.options.map((opt, i) => (
              <option key={i} value={i}>
                Option {i + 1}
              </option>
            ))}
          </select>

        </div>
      ))}

      <button className="btn btn-success mt-3" onClick={addQuestion}>
        + Add Question
      </button>
    </div>
  );
}

export default TestCreator;