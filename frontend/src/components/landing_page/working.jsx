import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CollegeImg from "../../assets/college.jpeg";
import SuggestImg from "../../assets/suggestions.jpeg";
import TestImg from "../../assets/test.jpeg";
import "./working.css";

const workingSteps = [
  {
    id: "step-quiz",
    number: "Step 01",
    stage: "Assessment",
    icon: "fas fa-clipboard-check",
    title: "Begin with a smart aptitude quiz",
    description:
      "Students start with a guided assessment that captures strengths, interests, and problem-solving patterns. The experience is fast, clear, and built to reveal what direction fits best.",
    image: TestImg,
    imageAlt: "Student taking the VisionEd aptitude quiz",
    stats: [
      { value: "100+", label: "Students exploring the quiz" },
      { value: "4 areas", label: "Core aptitude dimensions measured" },
    ],
    cta: {
      label: "Start Quiz",
      to: "/quiz",
    },
  },
  {
    id: "step-career",
    number: "Step 02",
    stage: "AI Insight",
    icon: "fas fa-brain",
    title: "Get AI-based career suggestions",
    description:
      "Once the quiz is complete, VisionEd turns your responses into meaningful recommendations. The system highlights high-fit roles, score trends, and the kind of work that suits your profile.",
    image: SuggestImg,
    imageAlt: "AI-powered career suggestion preview",
    stats: [
      { value: "100+", label: "Career pathways supported" },
      { value: "Live", label: "Personalized result generation" },
    ],
    cta: {
      label: "See Career Match",
      to: "/career",
    },
  },
  {
    id: "step-college",
    number: "Step 03",
    stage: "Next Move",
    icon: "fas fa-university",
    title: "Explore colleges and your next roadmap",
    description:
      "The final step connects career direction with real next actions. Students can review recommended colleges, skill priorities, and the roadmap needed to move from interest to opportunity.",
    image: CollegeImg,
    imageAlt: "College recommendation and roadmap preview",
    stats: [
      { value: "50+", label: "College options referenced" },
      { value: "Actionable", label: "Guidance built for the next step" },
    ],
    cta: {
      label: "View Guidance",
      to: "/career",
    },
  },
];

export default function Working() {
  const [visibleItems, setVisibleItems] = useState({});
  const itemRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.15 }
    );

    Object.values(itemRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      Object.values(itemRefs.current).forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  return (
    <section className="working-page">
      <div className="working-shell">
        <div className="working-header">
          <span className="working-tag">How It Works</span>
          <h2>How VisionEd takes students from uncertainty to clarity</h2>
          <p>
            The journey is simple: assess your strengths, uncover high-fit careers, and get a
            clearer plan for colleges and skills that match your future.
          </p>
        </div>

        <div className="working-flow">
          {workingSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <article
                ref={(element) => {
                  itemRefs.current[step.id] = element;
                }}
                id={step.id}
                className={[
                  "working-step-card",
                  visibleItems[step.id] ? "is-visible" : "",
                  index % 2 === 1 ? "working-step-card--reverse" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="working-step-visual">
                  <div className="working-step-orb"></div>
                  <div className="working-step-image-frame">
                    <img src={step.image} alt={step.imageAlt} />
                  </div>
                  <div className="working-step-float">
                    <i className={step.icon} aria-hidden="true"></i>
                    <span>{step.stage}</span>
                  </div>
                </div>

                <div className="working-step-content">
                  <div className="working-step-meta">
                    <span className="working-step-number">{step.number}</span>
                    <span className="working-step-stage">{step.stage}</span>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  <div className="working-step-stats">
                    {step.stats.map((stat) => (
                      <div className="working-step-stat" key={stat.label}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={step.cta.to} className="working-step-link">
                    {step.cta.label}
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>

              {index < workingSteps.length - 1 && (
                <div className="working-connector" aria-hidden="true">
                  <span className="working-connector-line"></span>
                  <span className="working-connector-badge">
                    <i className="fas fa-arrow-down"></i>
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
