import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./QuizPage.css";

const SECTIONS = [
  {
    key: "programming",
    label: "Programming & Logic",
    questions: [
      {
        id: 1,
        text: "What is the output?\n\nfor (let i = 0; i < 3; i++) { console.log(i); }",
        options: ["0 1 2", "1 2 3", "0 1 2 3", "Error"],
        answer: "0 1 2",
      },
      {
        id: 2,
        text: "Which data structure uses LIFO (Last In, First Out) principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: "Stack",
      },
      {
        id: 3,
        text: "What is the time complexity of Binary Search?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
        answer: "O(log n)",
      },
    ],
  },
  {
    key: "algorithms",
    label: "Algorithms & Data Structures",
    questions: [
      {
        id: 4,
        text: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
        answer: "Merge Sort",
      },
      {
        id: 5,
        text: "In a Binary Search Tree, where is the smallest element located?",
        options: ["Root", "Rightmost node", "Leftmost node", "Any leaf node"],
        answer: "Leftmost node",
      },
      {
        id: 6,
        text: "How many edges does a complete graph with 4 vertices have?",
        options: ["4", "6", "8", "12"],
        answer: "6",
      },
    ],
  },
  {
    key: "os_networks",
    label: "OS & Networking",
    questions: [
      {
        id: 7,
        text: "Which scheduling algorithm can cause starvation?",
        options: ["Round Robin", "FCFS", "Priority Scheduling", "SJF (non-preemptive)"],
        answer: "Priority Scheduling",
      },
      {
        id: 8,
        text: "What does the OSI Transport layer primarily handle?",
        options: ["Routing packets", "End-to-end communication & error control", "Physical transmission", "Data encoding"],
        answer: "End-to-end communication & error control",
      },
      {
        id: 9,
        text: "Which IP address range belongs to Class C?",
        options: ["0.0.0.0 – 127.x.x.x", "128.x – 191.x.x.x", "192.0.0.0 – 223.255.255.255", "224.x – 239.x.x.x"],
        answer: "192.0.0.0 – 223.255.255.255",
      },
    ],
  },
  {
    key: "dbms",
    label: "DBMS & Web Concepts",
    questions: [
      {
        id: 10,
        text: "Which SQL clause filters results after grouping?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        answer: "HAVING",
      },
      {
        id: 11,
        text: "What does normalization in DBMS aim to eliminate?",
        options: ["Indexes", "Data redundancy", "Foreign keys", "Query performance"],
        answer: "Data redundancy",
      },
      {
        id: 12,
        text: "Which HTTP method updates an existing resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: "PUT",
      },
    ],
  },
  {
    key: "oop",
    label: "Object-Oriented Programming",
    questions: [
      {
        id: 13,
        text: "Which OOP concept allows a class to inherit properties from multiple classes?",
        options: ["Encapsulation", "Polymorphism", "Multiple Inheritance", "Abstraction"],
        answer: "Multiple Inheritance",
      },
      {
        id: 14,
        text: "What is method overriding?",
        options: [
          "Defining two methods with same name but different parameters",
          "Redefining a parent class method in a child class",
          "Hiding class attributes",
          "Calling a method inside a constructor",
        ],
        answer: "Redefining a parent class method in a child class",
      },
      {
        id: 15,
        text: "Which keyword is used to prevent a class from being inherited in Java?",
        options: ["static", "private", "final", "abstract"],
        answer: "final",
      },
    ],
  },
  {
    key: "computer_architecture",
    label: "Computer Organization & Architecture",
    questions: [
      {
        id: 16,
        text: "Which component fetches and executes instructions in a CPU?",
        options: ["ALU", "Cache", "Control Unit", "Register"],
        answer: "Control Unit",
      },
      {
        id: 17,
        text: "What is the function of a cache memory?",
        options: [
          "Permanent data storage",
          "Stores frequently accessed data for fast retrieval",
          "Connects CPU to RAM",
          "Manages I/O operations",
        ],
        answer: "Stores frequently accessed data for fast retrieval",
      },
      {
        id: 18,
        text: "Which number system uses base 16?",
        options: ["Binary", "Octal", "Decimal", "Hexadecimal"],
        answer: "Hexadecimal",
      },
    ],
  },
  {
    key: "software_engineering",
    label: "Software Engineering",
    questions: [
      {
        id: 19,
        text: "Which SDLC model is best suited for projects with well-defined requirements?",
        options: ["Agile", "Spiral", "Waterfall", "RAD"],
        answer: "Waterfall",
      },
      {
        id: 20,
        text: "What does 'refactoring' mean in software development?",
        options: [
          "Adding new features to the code",
          "Restructuring existing code without changing its behavior",
          "Rewriting the entire application",
          "Fixing critical security bugs",
        ],
        answer: "Restructuring existing code without changing its behavior",
      },
      {
        id: 21,
        text: "Which testing checks the internal logic of the code?",
        options: ["Black-box testing", "White-box testing", "Regression testing", "System testing"],
        answer: "White-box testing",
      },
    ],
  },
  {
    key: "cyber_security",
    label: "Cyber Security",
    questions: [
      {
        id: 22,
        text: "Which attack intercepts communication between two parties without their knowledge?",
        options: ["Phishing", "Man-in-the-Middle", "DDoS", "SQL Injection"],
        answer: "Man-in-the-Middle",
      },
      {
        id: 23,
        text: "What does SSL/TLS provide in web communication?",
        options: ["Faster page load", "Encrypted and secure data transmission", "Data compression", "IP masking"],
        answer: "Encrypted and secure data transmission",
      },
      {
        id: 24,
        text: "Which hashing algorithm produces a 256-bit hash value?",
        options: ["MD5", "SHA-1", "SHA-256", "CRC32"],
        answer: "SHA-256",
      },
    ],
  },
  {
    key: "machine_learning",
    label: "AI & Machine Learning",
    questions: [
      {
        id: 25,
        text: "Which algorithm is used for classification and regression using decision boundaries?",
        options: ["K-Means", "SVM", "Apriori", "PCA"],
        answer: "SVM",
      },
      {
        id: 26,
        text: "What type of learning uses labeled training data?",
        options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Semi-supervised Learning"],
        answer: "Supervised Learning",
      },
      {
        id: 27,
        text: "Which activation function outputs values between 0 and 1?",
        options: ["ReLU", "Tanh", "Sigmoid", "Softmax"],
        answer: "Sigmoid",
      },
    ],
  },
  {
    key: "cloud_computing",
    label: "Cloud Computing",
    questions: [
      {
        id: 28,
        text: "Which cloud service model provides virtualized computing infrastructure?",
        options: ["SaaS", "PaaS", "IaaS", "FaaS"],
        answer: "IaaS",
      },
      {
        id: 29,
        text: "What is auto-scaling in cloud computing?",
        options: [
          "Manually adding servers",
          "Automatically adjusting resources based on demand",
          "Migrating data between regions",
          "Encrypting cloud storage",
        ],
        answer: "Automatically adjusting resources based on demand",
      },
      {
        id: 30,
        text: "Which cloud deployment model is exclusively used by a single organization?",
        options: ["Public Cloud", "Hybrid Cloud", "Community Cloud", "Private Cloud"],
        answer: "Private Cloud",
      },
    ],
  },
  {
    key: "compiler_design",
    label: "Compiler Design",
    questions: [
      {
        id: 31,
        text: "Which phase of a compiler converts source code into tokens?",
        options: ["Syntax Analysis", "Semantic Analysis", "Lexical Analysis", "Code Generation"],
        answer: "Lexical Analysis",
      },
      {
        id: 32,
        text: "What does a parser generate during syntax analysis?",
        options: ["Symbol Table", "Parse Tree", "Object Code", "Token Stream"],
        answer: "Parse Tree",
      },
      {
        id: 33,
        text: "Which grammar is used by most programming language parsers?",
        options: ["Type 0 Grammar", "Context-Sensitive Grammar", "Context-Free Grammar", "Regular Grammar"],
        answer: "Context-Free Grammar",
      },
    ],
  },
  {
    key: "computer_graphics",
    label: "Computer Graphics",
    questions: [
      {
        id: 34,
        text: "Which algorithm is used for line drawing in computer graphics?",
        options: ["Dijkstra's Algorithm", "Bresenham's Line Algorithm", "Floyd-Warshall", "Prim's Algorithm"],
        answer: "Bresenham's Line Algorithm",
      },
      {
        id: 35,
        text: "What does RGB stand for in computer graphics?",
        options: ["Red, Green, Blue", "Raster, Grid, Bitmap", "Render, Generate, Blend", "Red, Grey, Black"],
        answer: "Red, Green, Blue",
      },
      {
        id: 36,
        text: "Which transformation changes the size of an object?",
        options: ["Translation", "Rotation", "Scaling", "Shearing"],
        answer: "Scaling",
      },
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
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setError("");
  };

  const calculateScores = () => {
    const scores = {};

    SECTIONS.forEach((section) => {
      const total = section.questions.length;
      const correct = section.questions.reduce(
        (count, question) => count + (answers[question.id] === question.answer ? 1 : 0),
        0
      );

      scores[section.key] = total ? 1 + (correct / total) * 4 : 1;
    });

    return scores;
  };

  const getQuestionIndex = (sectionIndex, questionIndex) =>
    SECTIONS.slice(0, sectionIndex).reduce((acc, section) => acc + section.questions.length, 0) + questionIndex + 1;

  const handleSubmit = async () => {
    if (answered !== TOTAL_QUESTIONS) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const finalScores = calculateScores();

    try { 
      setIsSubmitting(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Please login first");
      }

      const res = await fetch("http://localhost:5000/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ scores: finalScores }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Prediction failed. Please try again.");
      }

      navigate("/career", {
        state: {
          result: data.result,
          scores: finalScores,
          saveStatus: data.message,
          savedResultId: data.savedResultId,
        },
      });
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
          Choose the best answer for each question. Every section contributes to your career match.
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
            const isAnswered = answers[q.id] !== undefined;
            const globalIdx = getQuestionIndex(SECTIONS.indexOf(section), idx);

            return (
              <div
                key={q.id}
                className={`quiz-question-card ${isAnswered ? "is-answered" : ""}`}
              >
                <div className="quiz-question-card__header">
                  <span className="quiz-question-card__num">{globalIdx}</span>
                  <p className="quiz-question-card__text" style={{ whiteSpace: "pre-line" }}>{q.text}</p>
                </div>

                <div className="quiz-options">
                  {q.options.map((option) => (
                    <label key={option} className={`quiz-option ${answers[q.id] === option ? "is-selected" : ""}`}>
                      <input
                        type="radio"
                        className="quiz-option__input"
                        name={`q-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                      />
                      <span className="quiz-option__label">{option}</span>
                    </label>
                  ))}
                </div>

                <div className="quiz-scale-legend">
                  <span>Pick one option</span>
                  <span>{q.options.length} choices</span>
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
