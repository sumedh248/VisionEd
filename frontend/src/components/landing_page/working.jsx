import React, { useRef, useEffect, useState } from "react";
import Working1 from "./working1";
import "./working.css";
import Working2 from "./working2";
import Working3 from "./working3";

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
      { threshold: 0.1 }
    );

    Object.values(itemRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(itemRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="m-3  " style={{ backgroundColor: "#E8EDF2"}}>
      <h2 className="text-center text-black mt-5 mb-5">How we work</h2>
      <div
        ref={(el) => (itemRefs.current.working1 = el)}
        id="working1"
        className={`card-zoom ${visibleItems.working1 ? "fade-in-working" : ""}`}
      >
        <Working1 />
      </div>
      <div className="d-flex justify-content-center align-items-center my-4">
        <i className="fa-solid fa-arrow-down fs-1 fw-bold bounce-arrow"></i>
      </div>
      <div
        ref={(el) => (itemRefs.current.working2 = el)}
        id="working2"
        className={`card-zoom ${visibleItems.working2 ? "fade-in-working" : ""}`}
      >
        <Working2 />
      </div>
      <div className="d-flex justify-content-center align-items-center my-4">
        <i className="fa-solid fa-arrow-down fs-1 fw-bold bounce-arrow"></i>
      </div>
      <div
        ref={(el) => (itemRefs.current.working3 = el)}
        id="working3"
        className={`card-zoom ${visibleItems.working3 ? "fade-in-working" : ""}`}
      >
        <Working3 />
      </div>
    </div>
  );
}
