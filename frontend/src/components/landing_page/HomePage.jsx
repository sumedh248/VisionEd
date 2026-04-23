import React from "react";
import Hero from "./hero";
import Working from "./working";
import { Link } from "react-router-dom";
export default function HomePage() {
  return (
   <div style={{ backgroundColor: "#E8EDF2"}}>
      <Hero/>
      <Working/>      
    
    </div>
  );
}
